import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UpsellItem } from 'src/app/grubbrr/core/models/upsell.model';
import {
  ItemUpsellGroupListVM,
  ItemUpsellGroupPropertiesVM,
  ItemUpsellGroupVM,
  ItemUpsellOfferVM,
} from 'src/app/grubbrr/generated/upsell_pb';
import { MenuService } from 'src/app/grubbrr/service/menu.service';
import { UpsellService } from 'src/app/grubbrr/service/upsell.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';

type SelectableItem = UpsellItem & { triggered?: boolean };

@Component({
  selector: 'app-item-upsell-add',
  templateUrl: './item-upsell-add.component.html',
  styleUrls: ['./item-upsell-add.component.scss'],
})
export class ItemUpsellAddComponent implements OnInit {
  locationId: string;
  upsellID = '';

  groupData: ItemUpsellGroupVM[];
  currentGroup: ItemUpsellGroupVM;
  menuItems: SelectableItem[] = [];
  offers: SelectableItem[] = [];
  triggers: SelectableItem[] = [];

  public propertiesForm: FormGroup;
  isformValid: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public loader: NgxUiLoaderService,
    private menuService: MenuService,
    private upsellService: UpsellService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private toast: ToastrService,
    public navigation: NavigationService
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
    let menu = (await this.menuService.getMenu(this.locationId)).effectiveMenu!;
    this.menuItems = menu.menuItems.map((item) => {
      return { object: item, type: 'item' };
    });

    let data = await this.upsellService.getItemUpsellGroups(this.locationId);
    this.loader.stop();
    this.groupData = data.groups;
    let maplist: any = [];
    for (let item of this.groupData) {
      maplist = [...maplist, ...item.mapping.map((a: any) => a.id.menuItemId)];
    }

    for (let item of maplist) {
      let triggeredIndex = this.menuItems.findIndex((a) => a.object.id == item);
      this.menuItems[triggeredIndex].triggered = true;
    }

    this.initializeForm();
    this.cdr.detectChanges();
  }

  private async initializeForm() {
    if (this.upsellID) {
      this.currentGroup = this.groupData[Number(this.upsellID)];
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
      }
    });

    this.triggers = [];
    this.currentGroup.mapping.forEach((mapping) => {
      switch (mapping.id.oneofKind) {
        case 'menuItemId':
          let item = this.menuItems.find(this.finder(mapping.id.menuItemId));
          if (item) this.triggers.push(item);
          break;
      }
    });
  }

  checkValidation() {
    let upsellName = this.propertiesForm?.get('name')?.value as any;
    this.isformValid =
      upsellName?.length > 0 &&
      this.offers?.length > 0 &&
      this.triggers?.length > 0;
  }

  private createBlankGroup(): ItemUpsellGroupVM {
    return {
      offers: [],
      conditions: {
        tests: [],
      },
      mapping: [],
    } as ItemUpsellGroupVM;
  }

  finder = (id: string) => (offer: UpsellItem) => offer.object.id === id;

  async onSelectOffer([offer, isAdd, type]: [UpsellItem, boolean, string]) {
    if (type == 'Trigger Item') {
      if (isAdd) {
        this.triggers.push(offer);
      } else {
        this.triggers = this.triggers.filter(
          (x) => x.object.id != offer.object.id
        );
      }
    } else {
      if (isAdd) {
        this.offers.push(offer);
      } else {
        this.offers = this.offers.filter((x) => x.object.id != offer.object.id);
      }
    }
    this.checkValidation();
  }

  async SaveUpsellGroup() {
    let OfferHolder: ItemUpsellOfferVM[] = [];
    let MappingHolder: ItemUpsellOfferVM[] = [];

    this.offers.forEach((offer) => {
      switch (offer.type) {
        case 'item':
          let individualOffer: ItemUpsellOfferVM = {
            id: {
              oneofKind: 'menuItemId',
              menuItemId: offer.object.id,
            },
          };
          OfferHolder.push(individualOffer);
          break;
      }
    });

    this.triggers.forEach((mapping) => {
      switch (mapping.type) {
        case 'item':
          let individualOffer: ItemUpsellOfferVM = {
            id: {
              oneofKind: 'menuItemId',
              menuItemId: mapping.object.id,
            },
          };
          MappingHolder.push(individualOffer);
          break;
      }
    });

    this.currentGroup.offers = OfferHolder;
    this.currentGroup.mapping = MappingHolder;
    this.currentGroup.properties =
      this.propertiesForm.getRawValue() as ItemUpsellGroupPropertiesVM;

    if (this.upsellID) {
      this.groupData[Number(this.upsellID)] = this.currentGroup;
    } else {
      this.groupData.push(this.currentGroup);
    }

    this.saveUpsell();
  }

  async saveUpsell() {
    let UpsertCandidate = {} as ItemUpsellGroupListVM;

    UpsertCandidate.groups = this.groupData;

    try {
      await this.upsellService.upsertItemUpsellGroups(
        this.locationId,
        UpsertCandidate
      );
      this.toast.success('Successfully saved!');
    } catch {
      this.toast.error('There was an issue saving');
    }
    this.navigation.back();
  }
}
