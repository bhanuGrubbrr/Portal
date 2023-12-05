import { MenuItem, MenuService } from 'src/app/grubbrr/service/menu.service';
import { Input, Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  selector: 'app-modifiers',
  templateUrl: './modifiers.component.html',
  styleUrls: ['./modifiers.component.scss', '../shared.scss'],
})
export class ModifiersComponent implements OnInit {
  @Input() locationId: string;

  items: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  displayedItems: MenuItem[] = [];
  searchQuery = '';

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
  setDisplayedItems(x: MenuItem[]) {
    this.displayedItems = x;
    this.cdr.detectChanges();
  }
  refreshDisplayedItems() {
    let items = this.items;
    if (this.searchQuery) {
      const lowerQuery = this.searchQuery.toLowerCase();
      items = items.filter((item) => {
        return (
          item?.pos?.name?.toLowerCase().includes(lowerQuery) ||
          item.displayName.toLowerCase().includes(lowerQuery) ||
          item.id.toLowerCase().includes(lowerQuery)
        );
      });
    }
    if (this.filterAction == FilterActionEnum.Active) {
      items = items.filter((item) => item.isActive);
    } else if (this.filterAction == FilterActionEnum.InActive) {
      items = items.filter((item) => !item.isActive);
    }

    this.filteredItems = items;
    this.loaded = true;
    this.cdr.detectChanges();
  }

  goToPage(page: number) {
    this.page = page;
    this.refreshDisplayedItems();
  }

  private async fetchData() {
    this.items = await this.menuService.getUniqueModifiers(this.locationId);
    this.refreshDisplayedItems();
  }

  async onChangeActiveStatus(item: MenuItem, isActive: boolean) {
    this.loader.start();

    await this.menuService.updateMenuItem(this.locationId, item.id, {
      isActive,
    });
    item.isActive = isActive;
    this.toast.success('Saved modifier successfully');
    this.loader.stop();
  }

  onChangeSearch() {
    this.pageIndex = 0;
    this.refreshDisplayedItems();
  }

  /**
   * Toggle rows selection based on parent selection
   */
  toggleAllRows() {
    let isAllSelected = this.isAllSelected();
    this.filteredItems
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
      this.filteredItems
        ?.map((e) => e.id)
        .sort()
        .join(',')
    );
  }

  async applyBulkAction() {
    this.loader.start();
    const isActive =
      this.bulkActionStatus == FilterBulkActionEnum.Activate ? true : false;
    const menuItemRecords: Record<string, boolean>[] =
      this.selection.selected.map((r) => ({
        id: r,
        isActive: isActive,
      }));

    await this.menuService.updateMenuItemStatusBulk(
      this.locationId,
      menuItemRecords
    );

    this.toast.success('Saved modifiers successfully');
    this.loader.stop();
    this.filteredItems?.forEach((item) => {
      if (this.selection.selected.includes(item.id)) {
        item.isActive = isActive;
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
