import {
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { default as MB } from 'menu-builder/package/components/menu-builder/MenuBuilder.svelte';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { lastIndexOf } from 'lodash';
import { ComponentType, ToastrService } from 'ngx-toastr';
import {
  OrderTypeTestVM,
  SectionsTestVM,
  TestVM,
} from 'src/app/grubbrr/generated/common_pb';
import { MenuItem, MenuSection } from 'src/app/grubbrr/generated/menu_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { MenuService } from 'src/app/grubbrr/service/menu.service';
import { StorageService } from 'src/app/grubbrr/service/storage.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import {
  PageInfoService,
  PageLink,
} from 'src/app/metronic/_metronic/layout/core/page-info.service';
import { LocationService } from '../../../grubbrr/service/location.service';
import { OrderTypeRuleComponent } from './rules/OrderType/order-type-rule/order-type-rule.component';
import {
  IModalConfiguration,
  IModalResponse,
  InjectableUpsellConfig,
  RuleTypes,
} from './rules/rules';
import { SectionsRuleComponent } from './rules/Sections/sections-rule/sections-rule.component';
import { UpsellService } from 'src/app/grubbrr/service/upsell.service';
import {
  OrderUpsellGroupListVM,
  OrderUpsellGroupPropertiesVM,
  OrderUpsellGroupVM,
  OrderUpsellOfferVM,
} from 'src/app/grubbrr/generated/upsell_pb';

interface UpsellSection {
  object: MenuSection;
  type: 'category';
}

interface UpsellItem {
  object: MenuItem;
  type: 'item';
}

type UpsellOffer = UpsellSection | UpsellItem;

@Component({
  selector: 'app-order-upsell',
  templateUrl: './order-upsell.component.html',
  styleUrls: ['./order-upsell.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderUpsellComponent implements OnInit {
  get RuleTypes() {
    return RuleTypes;
  }

  pageTitle: string;
  locationId: string;
  showLoader = true;
  breadCrumbs: Array<PageLink> = [];
  hasParentLocation: boolean;

  EditMode: boolean = false;
  IsNew: boolean = false;
  UpsellsEnabled: boolean = false;

  // groups level
  UpsellGroups: OrderUpsellGroupVM[];
  CurrentGroup: OrderUpsellGroupVM & { index: number };

  // group level
  menuSections: UpsellSection[] = [];
  menuItems: UpsellItem[] = [];

  filteredCategory: string;
  filteredText: string;

  filteredMenuSections: UpsellSection[] = [];
  filteredMenuItems: UpsellItem[] = [];

  Offers: UpsellOffer[] = [];

  public PropertiesForm: FormGroup;

  constructor(
    public navigation: NavigationService,
    public storage: StorageService,
    public locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private pageService: PageInfoService,
    private route: ActivatedRoute,
    private breadCrumbService: BreadCrumbService,
    private menuService: MenuService,
    private upsellService: UpsellService,
    private toast: ToastrService,
    private fb: FormBuilder,
    private modal: NgbModal
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  finder = (id: string) => (offer: UpsellOffer) => offer.object.id === id;

  private async initPage() {
    this.locationId = this.route.snapshot.params.locationid;
    await this.setupPageTitle();
    await this.fetchData();
    this.showLoader = false;
    this.cdr.detectChanges();
  }

  private generateInjector(): InjectableUpsellConfig {
    return {
      providers: [
        {
          provide: IModalConfiguration,
          useValue: {
            locationId: this.locationId,
            tests: this.CurrentGroup.conditions?.tests,
          },
        },
      ],
    };
  }

  private CreateBlankGroup(): OrderUpsellGroupVM {
    return {
      offers: [],
      conditions: {
        tests: [],
      },
    } as OrderUpsellGroupVM;
  }

  private async LoadGroupOffers(group: OrderUpsellGroupVM) {
    this.filteredCategory = '';
    this.filteredText = '';
    this.Offers = [];
    group.offers.forEach((offer) => {
      switch (offer.id.oneofKind) {
        case 'menuItemId':
          let item = this.menuItems.find(this.finder(offer.id.menuItemId));
          if (item) this.Offers.push(item);
          break;
        case 'categoryId':
          let cat = this.menuSections.find(this.finder(offer.id.categoryId));
          if (cat) this.Offers.push(cat);
          break;
      }
    });
  }

  private async InitializeForm() {
    this.PropertiesForm = this.fb.group({
      name: [this.CurrentGroup.properties?.name, Validators.required],
    });
  }

  private async fetchData() {
    let menu = (await this.menuService.getMenu(this.locationId)).effectiveMenu!;
    let GroupData = await this.upsellService.getOrderUpsellGroups(
      this.locationId
    );
    this.menuItems = menu.menuItems.map((item) => {
      return { object: item, type: 'item' };
    });
    this.menuSections = menu.menuSections.map((section) => {
      return { object: section, type: 'category' };
    });

    //this.UpsellsEnabled = GroupData.enabled;

    this.UpsellGroups = GroupData.groups;

    this.updateSelectable();
  }

  public enterNewEdit() {
    let BlankGroup = this.CreateBlankGroup();
    this.IsNew = true;
    this.enterEditMode(BlankGroup, 0);
  }

  public exitEditMode() {
    this.EditMode = false;
    this.IsNew = false;
  }

  public enterEditMode(group: OrderUpsellGroupVM, index: number) {
    this.CurrentGroup = { ...group, index: index };

    this.LoadGroupOffers(group);
    this.InitializeForm();
    this.updateSelectable();
    this.EditMode = true;
  }

  private updateSelectable() {
    this.filteredMenuSections = this.menuSections.filter(
      (a) => !this.Offers.find(this.finder(a.object.id))
    );

    if (this.filteredCategory) {
      let section = this.menuSections.find(
        (section) => section.object.id == this.filteredCategory
      )?.object as MenuSection;
      let allowedItems = section.menuItemIds;

      if (allowedItems) {
        this.filteredMenuItems = this.menuItems.filter(
          (item) =>
            allowedItems?.indexOf(item.object.id) != -1 &&
            !this.Offers.find(this.finder(item.object.id))
        );
      }
    } else {
      this.filteredMenuItems = this.menuItems.filter(
        (a) => !this.Offers.find(this.finder(a.object.id))
      );
    }

    if (this.filteredText && this.filteredText != '') {
      this.filteredMenuItems = this.filteredMenuItems.filter((item) =>
        item.object.name.toLowerCase().includes(this.filteredText.toLowerCase())
      );
    }
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = 'Order Upsell';

    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId,
      this.pageTitle
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  drop(arr: Array<any>, event: CdkDragDrop<string[]>) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
  }

  async AddOffer(offer: UpsellOffer, i: any) {
    this.Offers.push(offer);
    this.updateSelectable();
  }

  RemoveOffer(index: number) {
    this.Offers.splice(index, 1);
    this.updateSelectable();
  }

  public async deleteGroup(group: OrderUpsellGroupVM, index: number) {
    this.UpsellGroups.splice(index, 1);
    this.cdr.detectChanges();
  }

  private async SaveGroups() {
    let UpsertCandidate = {} as OrderUpsellGroupListVM;

    UpsertCandidate.groups = this.UpsellGroups;
    //UpsertCandidate.enabled = this.UpsellsEnabled;
    try {
      await this.upsellService.upsertOrderUpsellGroups(
        this.locationId,
        UpsertCandidate
      );
      this.toast.success('Successfully saved!');
    } catch {
      this.toast.error('There was an issue saving');
    }
    this.cdr.detectChanges();
  }

  private async SaveCurrentGroup() {
    let UpsertCandidate = {} as OrderUpsellGroupListVM;

    let OfferHolder: OrderUpsellOfferVM[] = [];
    let individualOffer = {} as OrderUpsellOfferVM;

    this.Offers.forEach((offer) => {
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

    this.CurrentGroup.offers = OfferHolder;
    this.CurrentGroup.properties =
      this.PropertiesForm.getRawValue() as OrderUpsellGroupPropertiesVM;

    if (this.IsNew) {
      this.UpsellGroups.push(this.CurrentGroup);
      this.CurrentGroup.index = lastIndexOf(
        this.UpsellGroups,
        this.CurrentGroup
      );
      this.IsNew = false;
    }
    this.UpsellGroups[this.CurrentGroup.index] = this.CurrentGroup;
    UpsertCandidate.groups = this.UpsellGroups;
    //UpsertCandidate.enabled = this.UpsellsEnabled;

    try {
      await this.upsellService.upsertOrderUpsellGroups(
        this.locationId,
        UpsertCandidate
      );

      await this.fetchData();
      this.toast.success('Successfully saved upsell group!');
    } catch (ex: any) {
      this.toast.error('There was an issue saving upsell group.');
    }
  }

  async save() {
    if (!this.EditMode) {
      await this.SaveGroups();
    } else {
      await this.SaveCurrentGroup();
      this.exitEditMode();
    }
    this.cdr.detectChanges();
  }

  change(category: string) {
    this.filteredCategory = category;
    this.updateSelectable();
  }

  textFilterChange(newVal: string) {
    this.filteredText = newVal;
    this.updateSelectable();
  }

  GetOrCreateTest(oneofKind: string) {
    let test = this.CurrentGroup.conditions?.tests.find(
      (t) => t.test.oneofKind == oneofKind
    );
    if (test) return test;

    let index =
      this.CurrentGroup.conditions!.tests.push({
        test: {},
      } as unknown as TestVM) - 1;
    return this.CurrentGroup.conditions?.tests[index];
  }

  private async saveTest(response: IModalResponse) {
    switch (response.RuleType) {
      case RuleTypes.OrderTypeRule: {
        let test = this.GetOrCreateTest('orderTypeTest') as unknown as TestVM;
        test.test = {
          oneofKind: 'orderTypeTest',
          orderTypeTest: response.Payload as OrderTypeTestVM,
        };
        await this.SaveCurrentGroup();
        break;
      }
      case RuleTypes.SectionsRule: {
        let test = this.GetOrCreateTest('sectionsTest') as unknown as TestVM;
        test.test = {
          oneofKind: 'sectionsTest',
          sectionsTest: response.Payload as SectionsTestVM,
        };
        await this.SaveCurrentGroup();
        break;
      }
    }
  }

  HandleInput(event: any) {
    this.UpsellsEnabled = event.target.checked;
  }

  async open(rule: string) {
    var component: ComponentType<any>;

    switch (rule) {
      case 'OrderTypeRule':
        component = OrderTypeRuleComponent;
        break;
      case 'SectionsRule':
        component = SectionsRuleComponent;
        break;
      default:
        return;
    }

    let reference = this.modal.open(component, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      scrollable: true,
      centered: true,
      injector: Injector.create(this.generateInjector()),
    });
    let ref = (await reference.result) as IModalResponse;

    if (!ref.success) {
      return;
    } else {
      await this.saveTest(ref);
    }
  }
}
