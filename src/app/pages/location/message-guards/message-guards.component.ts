import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { default as MB } from 'menu-builder/package/components/menu-builder/MenuBuilder.svelte';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  GuardTrigger,
  MenuItem,
  MenuSection,
  MessageGuardVM,
} from 'src/app/grubbrr/generated/menu_pb';

import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { MenuService } from 'src/app/grubbrr/service/menu.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import {
  PageInfoService,
  PageLink,
} from 'src/app/metronic/_metronic/layout/core/page-info.service';
import { LocationService } from '../../../grubbrr/service/location.service';

@Component({
  selector: 'app-message-guards',
  templateUrl: './message-guards.component.html',
  styleUrls: ['./message-guards.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MessageGuardsComponent implements OnInit {
  pageTitle: string;
  locationId: string;
  showLoader = true;
  breadCrumbs: Array<PageLink> = [];
  hasParentLocation: boolean;
  img: any = {};

  EditMode: boolean = false;
  MappingMode: boolean = false;

  IsNew: boolean = false;

  MessageGuards: MessageGuardVM[];
  CurrentGuard: MessageGuardVM;

  public PropertiesForm: FormGroup;
  menuItems: MenuItem[] = [];
  menuCategories: MenuSection[] = [];

  triggers = {
    ADDING_TO_CART: GuardTrigger.ADDING_TO_CART,
    AFTER_PAYMENT: GuardTrigger.AFTER_PAYMENT,
  };

  constructor(
    public navigation: NavigationService,
    public locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private pageService: PageInfoService,
    private route: ActivatedRoute,
    private breadCrumbService: BreadCrumbService,
    private menuService: MenuService,
    private toast: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initPage();
    console.log(this.triggers);
  }

  addNewItemMapping() {
    if (!this.CurrentGuard.items) this.CurrentGuard.items = [];
    this.CurrentGuard.items.push('');
  }
  addNewCategoryMapping() {
    if (!this.CurrentGuard.categories) this.CurrentGuard.categories = [];
    this.CurrentGuard.categories.push('');
  }

  deleteItemMapping(index: number) {
    this.CurrentGuard.items.splice(index, 1);
    this.cdr.detectChanges();
  }
  deleteCategoryMapping(index: number) {
    this.CurrentGuard.categories.splice(index, 1);
    this.cdr.detectChanges();
  }

  public get availableItems() {
    return this.menuItems;
  }

  public get availableCats() {
    return this.menuCategories;
  }

  private async initPage() {
    this.locationId = this.route.snapshot.params.locationid;
    await this.setupPageTitle();
    await this.fetchData();
    this.showLoader = false;
    this.cdr.detectChanges();
  }

  private CreateBlankGroup(): MessageGuardVM {
    return {
      items: [] as string[],
      categories: [] as string[],
    } as MessageGuardVM;
  }

  private async InitializeForm() {
    this.PropertiesForm = this.fb.group({
      name: [this.CurrentGuard.name, Validators.required],
      message: this.fb.group({
        title: [this.CurrentGuard.message?.title, Validators.required],
        subtitle: [this.CurrentGuard.message?.subtitle],
        image: [this.CurrentGuard.image ?? null],
      }),
      trigger: [this.CurrentGuard.trigger],
      enabled: [true],
    });
  }

  private async fetchData() {
    let menu = await this.menuService.getMenu(this.locationId);

    //this.itemMapping = mapping.items;
    //this.categoryMapping = mapping.categories;

    this.menuItems = menu.effectiveMenu!.menuItems;
    this.menuCategories = menu.effectiveMenu!.menuSections;
    this.MessageGuards = (
      await this.menuService.GetMessageGuards(this.locationId)
    ).guards;
  }

  public enterNewEdit() {
    let BlankGroup = this.CreateBlankGroup();
    this.IsNew = true;
    this.enterEditMode(BlankGroup, 0);
  }

  public enterMapping() {
    this.MappingMode = true;
    this.cdr.detectChanges();
  }

  public default() {
    this.EditMode = false;
    this.IsNew = false;
    this.MappingMode = false;
  }

  public enterEditMode(group: MessageGuardVM, index: number) {
    this.CurrentGuard = { ...group };

    this.InitializeForm();
    this.EditMode = true;
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = 'Message Guards';

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

  public async deleteGuard(guard: MessageGuardVM, index: number) {
    try {
      await this.menuService.DeleteMessageGuard(this.locationId, guard.id);
      this.MessageGuards.splice(index, 1);
      this.toast.success('Successfully deleted guard');
    } catch {
      this.toast.error('Failed to remove guard');
    }

    this.cdr.detectChanges();
  }

  private async SaveGuards() {
    try {
      this.toast.success('Successfully saved!');
    } catch {
      this.toast.error('There was an issue saving');
    }
    this.cdr.detectChanges();
  }

  private async SaveCurrentGroup() {
    let upsert = Object.assign(
      {},
      this.CurrentGuard,
      this.PropertiesForm.getRawValue() as MessageGuardVM
    );
    upsert.trigger = Number(this.PropertiesForm.get('trigger')?.value);

    if (
      this.PropertiesForm?.get('message')?.get('image')?.value &&
      this.PropertiesForm?.get('message')?.get('image')?.dirty
    ) {
      try {
        const url = await this.menuService.uploadImage(
          this.locationId,
          this.PropertiesForm?.get('message')?.get('image')?.value
        );
        upsert.image = url;
      } catch {
        upsert.image = '';
      }
    } else if (!this.PropertiesForm?.get('message')?.get('image')?.value) {
      upsert.image = '';
    }

    if (this.IsNew) {
      await this.menuService.CreateMessageGuard(this.locationId, upsert);
      await this.fetchData();
      this.IsNew = false;
    } else {
      try {
        await this.menuService.UpdateMessageGuard(this.locationId, upsert);
        await this.fetchData();
        this.toast.success('Successfully saved  message!');
      } catch (ex: any) {
        console.log(ex, upsert);
        this.toast.error('There was an issue saving message');
      }
    }
  }

  async save() {
    if (this.MappingMode) {
      this.default();
    } else if (this.EditMode) {
      await this.SaveCurrentGroup();
      this.default();
    } else {
      await this.SaveGuards();
    }
    this.cdr.detectChanges();
  }
}
