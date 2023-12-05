import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  MenuCategoryWithItems,
  MenuItem,
  MenuService,
} from 'src/app/grubbrr/service/menu.service';
import { Router } from '@angular/router';
import { MenuCategoryLayout } from 'src/app/grubbrr/generated/menu_pb';
import { DropdownSelectComponent } from '../../../dropdown-select/dropdown-select.component';
export type CategoryFormValues = {
  displayName?: string | undefined;
  isActive?: boolean | undefined;
  image?: File | undefined;
  items?: string[] | undefined;
};

@Component({
  selector: 'app-menu-category-row',
  templateUrl: './menu-category-row.component.html',
  styleUrls: ['./menu-category-row.component.scss'],
})
export class MenuCategoryRowComponent {
  @Input() locationId: string;
  @Input() isLoyaltyEnabled: boolean;
  @Input() layout: any;
  @Input() category: MenuCategoryWithItems;
  @Input() showMenuItems: boolean = false;
  @Input() allItems: MenuItem[];
  @Input() level: number;
  @Input() statusFilter: number;
  public categoryMargin: number = 20;
  public itemMargin: number = 25;
  @Output() clickItemToAdd = new EventEmitter<any>();
  @Output() clickRemoveCategory = new EventEmitter<MenuCategoryWithItems>();
  @Output() clickRemoveMenuItem = new EventEmitter<any>();
  @Output() clickEditMenuItem = new EventEmitter<any>();
  @Output() clickColumnSelection = new EventEmitter<any>();
  @Input() showSubcategoryMenuItems: boolean = false;
  @Output() sortCategoryItems = new EventEmitter<any>();

  editMode: boolean = false;

  isItemListEditorVisible: boolean = false;
  categoryForm: FormGroup;
  subCategories: MenuCategoryWithItems[] = [];
  items: MenuItem[] = [];
  options = ['Remove', 'Edit'];
  loyaltyOnly: boolean = false;
  @Output() setLoyaltyOnly = new EventEmitter<any>();
  @ViewChild('dropdownSelect') dropdownSelect: DropdownSelectComponent;
  ngOnChanges() {
    this.subCategories = this.category?.subCategories;
    this.items = this.category?.items;
    if (this.statusFilter == 1) {
      this.subCategories = this.category?.subCategories.filter(
        (subCategory) => subCategory.isActive
      );
      this.items = this.category?.items.filter((item) => item.isActive);
    } else if (this.statusFilter == 2) {
      this.subCategories = this.category?.subCategories.filter(
        (subCategory) => !subCategory.isActive
      );
      this.items = this.category?.items.filter((item) => !item.isActive);
    }
    this.initLoyaltyOnly();
  }
  initLoyaltyOnly() {
    if (this.isLoyaltyEnabled) {
      const category = this.layout.categories.find(
        (layoutCat: MenuCategoryLayout) =>
          layoutCat.categoryId == this.category.id
      );
      if (category) {
        this.loyaltyOnly = category.loyaltyOnly;
      }
      const loyaltyOption = this.loyaltyOnly
        ? 'Remove Loyalty Only'
        : 'Set as Loyalty Only';
      this.options = ['Remove', loyaltyOption, 'Edit'];
    }
  }

  constructor(private router: Router) {}

  drop(arr: Array<any>, event: CdkDragDrop<string[]>, type: number) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.sortCategoryItems.emit({
      parentCat: this.category,
      subCat: arr,
      type,
    });
  }

  onSortCategoryItems(data: any) {
    this.sortCategoryItems.emit(data);
  }
  handleRemoveClick(menuItem: MenuItem, category: MenuCategoryWithItems) {
    if (
      confirm(
        `Are you sure you want to remove ${menuItem.displayName} from the category '${category.displayName}'?`
      )
    ) {
      this.clickRemoveMenuItem.emit({ menuItem, category });
    }
    const itemIndex = this.items.findIndex(
      (i: MenuItem) => i.id == menuItem.id
    );
    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1);
    }
  }

  ClickRemoveItem(event: any) {
    let { menuItem, category } = event;
    this.clickRemoveMenuItem.emit({ menuItem, category });
  }

  handleEditMenuItem(locationId: string, menuItem: MenuItem) {
    this.clickEditMenuItem.emit({ locationId, menuItem });
  }

  ClickEditMenuItem(event: any) {
    let { locationId, menuItem } = event;
    this.clickEditMenuItem.emit({ locationId, menuItem });
  }

  get availableItems() {
    return this.allItems.filter(
      (it) => !this.category.items.find((i) => it.id === i.id) && it.isActive
    );
  }

  toggle() {
    if (!this.category) return;

    const selectedCategory = this.category;

    if (!selectedCategory) {
      console.log('Category not found.');
      return;
    }

    this.isItemListEditorVisible = false;
    this.showMenuItems = !this.showMenuItems;
  }

  showItemListEditor() {
    this.isItemListEditorVisible = true;
  }

  getSuggestionLabel(entity: MenuItem) {
    return entity.displayName;
  }

  getSuggestionLabelId(entity: MenuItem) {
    return entity.id;
  }

  onSelectOption(entity: MenuItem) {
    if (!this.category.items.find((i) => i.id === entity.id)) {
      this.category.items.push(entity);
      this.items.push(entity);
    }

    this.isItemListEditorVisible = !this.isItemListEditorVisible;

    this.clickItemToAdd.emit({ category: this.category, item: entity });
  }

  async ClickAddItem(event: any) {
    let { category, item } = event;
    this.clickItemToAdd.emit({ category: category, item: item });
  }

  onClickRemove(index: any) {
    if (index == 0) {
      this.clickRemoveCategory.emit(this.category);
    } else if (this.isLoyaltyEnabled && index == 1) {
      this.setLoyaltyOnly.emit({
        category: this.category,
        loyaltyOnly: !this.loyaltyOnly,
        dropdownSelect: this.dropdownSelect,
      });
    } else if (
      (!this.isLoyaltyEnabled && index == 1) ||
      (this.isLoyaltyEnabled && index == 2)
    ) {
      this.router.navigate(
        [
          `/location/${this.locationId}/kiosk-designer/menu/category/edit/${this.category.id}`,
        ],
        { queryParams: { tab: '1' } }
      );
    }
  }

  ClickRemoveCategory(event: any) {
    this.clickRemoveCategory.emit(event);
  }

  onColumnSelect(column: number, category: MenuCategoryWithItems) {
    this.clickColumnSelection.emit({ column, category });
  }

  onClickColumnSelection(rowData: any) {
    this.clickColumnSelection.emit(rowData);
  }
}
