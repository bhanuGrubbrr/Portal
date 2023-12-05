import { Input, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  ModifierGroupWithModifiers,
  MenuService,
} from 'src/app/grubbrr/service/menu.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SelectionModel } from '@angular/cdk/collections';

export const enum FilterActionEnum {
  InActive = 0,
  Active = 1,
}

export const enum FilterBulkActionEnum {
  Activate = 1,
  Deactivate = 0,
  BulkAction = 2,
}
@Component({
  selector: 'app-company-kiosk-designer-modifier-group',
  templateUrl: './company-kiosk-designer-modifier-group.component.html',
  styleUrls: [
    './company-kiosk-designer-modifier-group.component.scss',
    '../../location/location-kiosk-designer/shared.scss',
  ],
})
export class CompanyKioskDesignerModifierGroupComponent implements OnInit {
  @Input() companyId: string;
  @Input() locationId: string;

  showSidenav: boolean = false;

  modifierGroups: ModifierGroupWithModifiers[] = [];
  filteredModifierGroups: ModifierGroupWithModifiers[] = [];
  displayedModifierGroups: ModifierGroupWithModifiers[] = [];
  modifiersToShow: { [modifierGroupId: string]: number } = {};
  menuItemsToShow: { [modifierGroupId: string]: number } = {};

  searchQuery = '';
  itemsToShow: { [modifierGroupId: string]: number } = {};
  numModsToShow: number = 5;
  numMenuItemsToShow: number = 5;
  page = 1;
  perPage = 25;

  pageIndex = 0;

  loaded: boolean = false;

  selection = new SelectionModel<any>(true, []);
  filterAction: FilterActionEnum = FilterActionEnum.Active;
  bulkActionStatus: FilterBulkActionEnum = FilterBulkActionEnum.BulkAction;
  constructor(
    private menuService: MenuService,
    private toast: ToastrService,
    private loader: NgxUiLoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  setDisplayedItems(x: ModifierGroupWithModifiers[]) {
    this.displayedModifierGroups = x;
    this.cdr.detectChanges();
  }
  refreshDisplayedItems() {
    let items = this.modifierGroups;
    if (this.searchQuery) {
      items = this.modifierGroups.filter((modifierGroup) => {
        return (
          modifierGroup?.id?.toLowerCase().includes(this.searchQuery) ||
          modifierGroup?.name?.toLowerCase().includes(this.searchQuery) ||
          modifierGroup.displayName.toLowerCase().includes(this.searchQuery)
        );
      });
    }
    if (this.filterAction == FilterActionEnum.Active) {
      items = items.filter((item) => item.isActive);
    } else if (this.filterAction == FilterActionEnum.InActive) {
      items = items.filter((item) => !item.isActive);
    }
    this.filteredModifierGroups = items;
    this.loaded = true;
    this.cdr.detectChanges();
  }

  goToPage(page: number) {
    this.pageIndex = page;
  }

  private async fetchData() {
    let modifierGroups = await this.menuService.getModifierGroups(
      this.locationId
    );
    this.modifierGroups = modifierGroups;
    this.refreshDisplayedItems();
  }

  formatModifiersForModifierGroup(
    modifierGroup: ModifierGroupWithModifiers,
    numModsToShow: number
  ): string {
    return modifierGroup.modifiers
      .slice(0, numModsToShow)
      .map((m) => m.menuItem.displayName)
      .join(', ');
  }

  formatMenuItemsForModifierGroup(
    modifierGroup: ModifierGroupWithModifiers,
    numMenuItemsToShow: number
  ): string {
    return modifierGroup.usedIn
      .slice(0, numMenuItemsToShow)
      .map((m) => m.displayName)
      .join(', ');
  }

  onModifiersItemsToShowChange(
    itemsToShow: number,
    modifierGroup: ModifierGroupWithModifiers
  ) {
    this.modifiersToShow[modifierGroup.id] = itemsToShow;
  }

  onMenuItemsToShowChange(
    newItemsToShow: number,
    modifierGroup: ModifierGroupWithModifiers
  ) {
    this.menuItemsToShow[modifierGroup.id] = newItemsToShow;
  }

  async onChangeActiveStatus(
    modifierGroup: ModifierGroupWithModifiers,
    isActive: boolean
  ) {
    this.loader.start();

    await this.menuService.updateModifierGroup(
      this.locationId,
      modifierGroup.id,
      {
        isActive,
      }
    );
    modifierGroup.isActive = isActive;
    this.toast.success('Saved modifier group successfully');
    this.loader.stop();
  }

  onChangeSearch() {
    this.page = 1;
    this.refreshDisplayedItems();
  }

  /**
   * Toggle rows selection based on parent selection
   */
  toggleAllRows() {
    let isAllSelected = this.isAllSelected();
    this.filteredModifierGroups
      ?.map((e) => e.id)
      .forEach((row) => {
        isAllSelected
          ? this.selection.deselect(row)
          : this.selection.select(row);
      });
  }

  /**
   * Check if all records are selected
   */
  isAllSelected() {
    return (
      this.selection.selected.sort().join(',') ==
      this.filteredModifierGroups
        ?.map((e) => e.id)
        .sort()
        .join(',')
    );
  }

  async applyBulkAction() {
    this.loader.start();
    const isActive =
      this.bulkActionStatus == FilterBulkActionEnum.Activate ? true : false;

    const modifierGroupRecords: Record<string, boolean>[] =
      this.selection.selected.map((r) => ({
        id: r,
        isActive: isActive,
      }));

    await this.menuService.updateModifierGroupStatusBulk(
      this.locationId,
      modifierGroupRecords
    );

    this.toast.success('Saved modifier groups successfully');
    this.loader.stop();
    this.filteredModifierGroups?.forEach((modifierGroup) => {
      if (this.selection.selected.includes(modifierGroup.id)) {
        modifierGroup.isActive = isActive;
      }
    });
    this.bulkActionStatus = FilterBulkActionEnum.BulkAction;
    this.selection.clear();
  }

  changeStatusFilter() {
    this.pageIndex = 0;
    this.refreshDisplayedItems();
    this.bulkActionStatus = FilterBulkActionEnum.BulkAction;
    this.selection.clear();
  }
}
