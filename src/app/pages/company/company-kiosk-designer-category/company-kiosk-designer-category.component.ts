import { ChangeDetectorRef, Input, Component, OnInit } from '@angular/core';
import {
  MenuCategory,
  MenuService,
} from 'src/app/grubbrr/service/menu.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SelectionModel } from '@angular/cdk/collections';

type SortColumn = 'pos-category-name' | 'category-name' | 'status';
type SortDirection = 'asc' | 'desc';

const flipDirection = (direction: SortDirection): SortDirection => {
  return direction === 'asc' ? 'desc' : 'asc';
};

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
  selector: 'app-company-kiosk-designer-category',
  templateUrl: './company-kiosk-designer-category.component.html',
  styleUrls: [
    './company-kiosk-designer-category.component.scss',
    '../../location/location-kiosk-designer/shared.scss',
  ],
})
export class CompanyKioskDesignerCategoryComponent implements OnInit {
  @Input() locationId: string;
  @Input() companyId: string;

  private categories: MenuCategory[] | null = null;
  displayCategories: MenuCategory[] | null = null;
  searchQuery = '';
  sortColumn: SortColumn = 'pos-category-name';
  sortDirection: SortDirection = 'asc';
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

  onClickColumn(column: SortColumn) {
    this.sortDirection =
      column === this.sortColumn
        ? flipDirection(this.sortDirection)
        : this.sortDirection;
    this.sortColumn = column;
  }

  sortComparator = (el1: MenuCategory, el2: MenuCategory): number => {
    if (this.sortColumn === 'pos-category-name') {
      const getValue = (x: MenuCategory) =>
        x.posCategory?.name ?? x.displayName;
      return getValue(el1).localeCompare(getValue(el2));
    } else if (this.sortColumn === 'category-name') {
      const getValue = (x: MenuCategory) => x.displayName;
      return getValue(el1).localeCompare(getValue(el2));
    } else if (this.sortColumn === 'status') {
      return el1.isActive < el2.isActive ? -1 : 1;
    } else {
      return 1;
    }
  };

  private async fetchData() {
    let categories = await this.menuService.getCategories(this.locationId);
    this.categories = categories.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });
    if (this.filterAction == FilterActionEnum.Active) {
      categories = this.categories.filter((category) => category.isActive);
    } else if (this.filterAction == FilterActionEnum.InActive) {
      categories = this.categories.filter((category) => !category.isActive);
    }
    this.displayCategories = categories;
    this.loaded = true;
    this.cdr.detectChanges();
  }

  async onChangeActiveStatus(category: MenuCategory, isActive: boolean) {
    this.loader.start();

    await this.menuService.updateCategory(this.locationId, category.id, {
      isActive,
    });

    this.toast.success('Saved category successfully');
    this.loader.stop();
  }

  handleSearchChange(e: any) {
    const query = e.target.value.toLowerCase();
    this.reloadData(query);
  }
  reloadData(query = '') {
    this.displayCategories =
      this.categories?.filter((category) => {
        return (
          category.posCategory?.name?.toLowerCase().includes(query) ||
          category.displayName.toLowerCase().includes(query)
        );
      }) ?? [];
    if (this.filterAction == FilterActionEnum.Active) {
      this.displayCategories = this.displayCategories.filter(
        (category) => category.isActive
      );
    } else if (this.filterAction == FilterActionEnum.InActive) {
      this.displayCategories = this.displayCategories.filter(
        (category) => !category.isActive
      );
    }
  }
  changeStatusFilter() {
    this.reloadData();
  }

  /**
   * Toggle rows selection based on parent selection
   */
  toggleAllRows() {
    let isAllSelected = this.isAllSelected();
    this.displayCategories
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
      this.displayCategories
        ?.map((e) => e.id)
        .sort()
        .join(',')
    );
  }

  async applyBulkAction() {
    this.loader.start();
    const isActive =
      this.bulkActionStatus == FilterBulkActionEnum.Activate ? true : false;

    const categoryRecords: Record<string, boolean>[] =
      this.selection.selected.map((r) => ({
        id: r,
        isActive: isActive,
      }));

    await this.menuService.updateCategoryStatusBulk(
      this.locationId,
      categoryRecords
    );

    this.toast.success('Saved categories successfully');
    this.loader.stop();
    this.displayCategories?.forEach((category) => {
      if (this.selection.selected.includes(category.id)) {
        category.isActive = isActive;
      }
    });
    this.bulkActionStatus = FilterBulkActionEnum.BulkAction;
    this.selection.clear();
  }
}
