import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  UpsellItem,
  UpsellSection,
} from 'src/app/grubbrr/core/models/upsell.model';
import { OrderTypeTestVM, TestVM } from 'src/app/grubbrr/generated/common_pb';
import { OrderTypeOptionVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import {
  OrderUpsellGroupListVM,
  OrderUpsellGroupPropertiesVM,
  OrderUpsellGroupVM,
  OrderUpsellOfferVM,
} from 'src/app/grubbrr/generated/upsell_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import { MenuService } from 'src/app/grubbrr/service/menu.service';
import { UpsellService } from 'src/app/grubbrr/service/upsell.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';

type SelectableOrderType = OrderTypeOptionVM & { checked?: boolean };
type SelectableUpsellGroup = OrderUpsellGroupPropertiesVM & {
  orderType?: string;
};
type UpsellOffer = UpsellSection | UpsellItem;

@Component({
  selector: 'app-order-upsell-add',
  templateUrl: './order-upsell-add.component.html',
  styleUrls: ['./order-upsell-add.component.scss'],
})
export class OrderUpsellAddComponent implements OnInit {
  upsellGroups: SelectableUpsellGroup[] = [];
  public orderTypes: SelectableOrderType[];
  groupData: OrderUpsellGroupVM[];

  locationId: string;

  offers: UpsellOffer[] = [];
  newArray: UpsellOffer[] = [];

  menuSections: UpsellOffer[] = [];
  menuItems: UpsellOffer[] = [];

  public propertiesForm: FormGroup;

  upsellID = '';
  currentGroup: OrderUpsellGroupVM;
  isformValid: boolean = false;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private kioskConfig: KioskConfigService,
    private fb: FormBuilder,
    private upsellService: UpsellService,
    private toast: ToastrService,
    public navigation: NavigationService,
    private cdr: ChangeDetectorRef,
    public loader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.route.queryParams.subscribe((params) => {
      this.upsellID = params?.id;
    });
    this.loader.start();
    this.fetchData();
  }

  private async fetchData() {
    let res = await this.kioskConfig.getOrderTypes(this.locationId);
    if (res) {
      this.orderTypes = res.options;
    }
    let menu = (await this.menuService.getMenu(this.locationId)).effectiveMenu!;
    this.menuItems = menu.menuItems.map((item) => {
      return { object: item, type: 'item' };
    });
    this.menuSections = menu.menuSections.map((section) => {
      return { object: section, type: 'category' };
    });

    let data = await this.upsellService.getOrderUpsellGroups(this.locationId);
    this.loader.stop();

    this.groupData = data.groups;

    this.initializeForm();
    this.cdr.detectChanges();
  }

  private async initializeForm() {
    if (this.upsellID) {
      this.currentGroup = this.groupData[Number(this.upsellID)];
      this.setOrderType();
      this.loadGroupOffers();
    } else {
      this.currentGroup = this.createBlankGroup();
    }

    this.propertiesForm = this.fb.group({
      name: [this.currentGroup.properties?.name, Validators.required],
      enabled: [this.currentGroup.properties?.enabled ?? true],
    });
    this.checkValidation();
  }
  private async loadGroupOffers() {
    this.offers = [];
    this.currentGroup.offers.forEach((offer) => {
      switch (offer.id.oneofKind) {
        case 'menuItemId':
          let item = this.menuItems.find(this.finder(offer.id.menuItemId));
          if (item) this.offers.push(item);

          break;
        case 'categoryId':
          let cat = this.menuSections.find(this.finder(offer.id.categoryId));
          if (cat) this.offers.push(cat);

          break;
      }
    });
  }

  checkValidation() {
    let upsellName = this.propertiesForm?.get('name')?.value as any;
    let orderTypeSelected = this.orderTypes.find((a: any) => a.checked)
      ? true
      : false;

    this.isformValid =
      orderTypeSelected && upsellName?.length > 0 && this.offers?.length > 0;
  }

  private setOrderType() {
    let tests = this.currentGroup.conditions?.tests?.find(
      (t) => t.test.oneofKind == 'orderTypeTest'
    );
    if (tests && tests.test.oneofKind == 'orderTypeTest') {
      tests.test.orderTypeTest.orderTypes.forEach((type) => {
        let target = this.orderTypes.find((o) => o.id == type);
        if (target) {
          target.checked = true;
        }
      });
    }
  }

  private createBlankGroup(): OrderUpsellGroupVM {
    return {
      offers: [],
      conditions: {
        tests: [],
      },
    } as OrderUpsellGroupVM;
  }

  finder = (id: string) => (offer: UpsellOffer) => offer.object.id === id;

  async SaveUpsellGroup() {
    let payload = { orderTypes: [] } as OrderTypeTestVM;
    let OfferHolder: OrderUpsellOfferVM[] = [];
    let individualOffer = {} as OrderUpsellOfferVM;

    this.orderTypes
      .filter((t) => t.checked)
      .forEach((type) => {
        payload.orderTypes.push(type.id);
      });
    let test = this.GetOrCreateTest('orderTypeTest') as unknown as TestVM;
    test.test = {
      oneofKind: 'orderTypeTest',
      orderTypeTest: payload,
    };

    this.offers.forEach((offer) => {
      switch (offer.type) {
        case 'category':
          individualOffer = {
            id: {
              oneofKind: 'categoryId',
              categoryId: offer.object.id,
            },
          };
          break;
        case 'item':
          individualOffer = {
            id: {
              oneofKind: 'menuItemId',
              menuItemId: offer.object.id,
            },
          };
          break;
      }
      OfferHolder.push(individualOffer);
    });

    this.currentGroup.offers = OfferHolder;
    this.currentGroup.properties =
      this.propertiesForm.getRawValue() as OrderUpsellGroupPropertiesVM;

    if (this.upsellID) {
      this.groupData[Number(this.upsellID)] = this.currentGroup;
    } else {
      this.groupData.push(this.currentGroup);
    }

    this.saveUpsell();
  }

  async saveUpsell() {
    let UpsertCandidate = {} as OrderUpsellGroupListVM;

    UpsertCandidate.groups = this.groupData;

    try {
      await this.upsellService.upsertOrderUpsellGroups(
        this.locationId,
        UpsertCandidate
      );
      this.toast.success('Successfully saved!');
    } catch {
      this.toast.error('There was an issue saving');
    }
    this.navigation.back();
  }

  GetOrCreateTest(oneofKind: string) {
    let test = this.currentGroup.conditions?.tests.find(
      (t) => t.test.oneofKind == oneofKind
    );
    if (test) return test;

    let index =
      this.currentGroup.conditions!.tests.push({
        test: {},
      } as unknown as TestVM) - 1;
    return this.currentGroup.conditions?.tests[index];
  }

  async onSelectOffer([offer, isAdd]: [UpsellOffer, boolean]) {
    if (isAdd) {
      this.offers.push(offer);
    } else {
      this.offers = this.offers.filter((x) => x.object.id != offer.object.id);
    }
    this.checkValidation();
  }

  handleInput(event: any, orderType: SelectableOrderType) {
    orderType.checked = event.target.checked;
    this.checkValidation();
  }
}
