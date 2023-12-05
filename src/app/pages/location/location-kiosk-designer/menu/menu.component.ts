import { ConceptsService } from 'src/app/grubbrr/service/concepts.service';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  MenuCategoryLayout,
  MenuLayout,
} from 'src/app/grubbrr/generated/menu_pb';
import {
  MenuCategory,
  MenuCategoryWithItemIds,
  MenuCategoryWithItems,
  MenuItem,
  MenuService,
  groupByGeneric,
} from 'src/app/grubbrr/service/menu.service';
import { ConceptVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { Router } from '@angular/router';
import { LoyaltyService2 } from 'src/app/grubbrr/service/loyaltyService.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-kiosk-designer-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  providers: [DecimalPipe],
})
export class MenuComponent implements OnInit {
  @Input() locationId: string;
  @Input() allItems: MenuItem[];
  allCategories: MenuCategoryWithItems[];
  categories: MenuCategoryWithItems[];
  allPOSCategories: MenuCategoryWithItemIds[];
  layout: MenuLayout;

  concepts: ConceptVM[] = [];
  activeConcept: ConceptVM | null = null;
  defaultLayoutId: string | null = null;
  conceptsEnabled: boolean;
  loading = true;
  searchQuery = '';
  statusFilter = 1;
  isLoyaltyEnabled: boolean;

  get currentMenuLayoutId(): string {
    return (this.activeConcept?.menuLayoutId ?? this.defaultLayoutId)!;
  }

  editMode: boolean = false;
  showLoader: boolean;
  showMenuItems: boolean = false;
  showSubcategoryMenuItems: boolean = false;
  isCategoryTypeaheadVisible = false;

  loaded: boolean = false;

  get availableCategoriesToAdd() {
    if (!this.allCategories) return [];
    const currentIds = new Set(this.allCategories.map((c) => c.id));
    const availableCategories = this.allPOSCategories.filter(
      (c) => !currentIds.has(c.id) && c.isActive
    );

    return availableCategories;
  }

  constructor(
    private menuService: MenuService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private conceptService: ConceptsService,
    private kioskConfigService: KioskConfigService,
    private router: Router,
    private loyaltyService: LoyaltyService2,
    private loader: NgxUiLoaderService
  ) {}

  categoryForm: FormGroup;

  get availableItems() {
    const currentItemIds = new Set(
      this.categoryForm.value.items.map((i: any) => i.id)
    );
    return this.allItems.filter((menuItem) => {
      return !currentItemIds.has(menuItem.id);
    });
  }

  getSuggestionLabelId(category: MenuCategory) {
    return category.id;
  }

  getSuggestionLabel(category: MenuCategory) {
    return category.displayName;
  }

  async onSelectOption(category: MenuCategory) {
    const allItemsById = groupByGeneric(
      this.allItems,
      (i) => i.id,
      (x) => x
    );
    const itemIds =
      this.allPOSCategories.find((c) => c.id === category.id)?.itemIds ?? [];
    const activeItemIds = itemIds.filter((i) => allItemsById[i]?.isActive);

    if (!category.isActive) {
      this.toastr.error(
        `Error: Cant add '${category.displayName}' because it's not an active category.`
      );
      return;
    }
    this.layout = {
      ...this.layout,
      categories: this.layout.categories.concat({
        categoryId: category.id,
        menuItemIds: activeItemIds,
        subCategories: [],
        numberOfColumns: category.numberOfColumns,
        loyaltyOnly: false, // THIS CHANGES WHEN PORTAL UI IS DONE
      }),
    };

    this.categories.push({
      ...category,
      items: activeItemIds.map((i) => allItemsById[i]),
      itemIds: activeItemIds,
      subCategories: [],
    });

    this.isCategoryTypeaheadVisible = false;
    {
      await this.menuService.updateMenuLayout(
        this.locationId,
        this.currentMenuLayoutId,
        this.layout
      );
      this.toastr.success(`Added ${category.displayName} to menu.`);
    }
  }

  async onClickRemoveCategory(category: MenuCategory) {
    // this.layout = {
    //   ...this.layout,
    //   categories: this.layout.categories.filter(
    //     (c) => c.categoryId !== category.id
    //   ),

    // };

    const filterCategories = (categories: any[], categoryId: string) => {
      return categories.filter((category) => {
        if (category.categoryId === categoryId) {
          // Exclude the category itself
          return false;
        }

        if (category.subCategories && category.subCategories.length > 0) {
          // Filter subcategories recursively
          category.subCategories = filterCategories(
            category.subCategories,
            categoryId
          );
          return true;
        }

        return true;
      });
    };

    // Usage
    const filteredCategories = filterCategories(
      this.layout.categories,
      category.id
    );

    this.layout = {
      ...this.layout,
      categories: filteredCategories,
    };

    this.categories = filteredCategories; //  this.categories.filter((c) => c.id !== category.id);

    await this.menuService.updateMenuLayout(
      this.locationId,
      this.currentMenuLayoutId,
      this.layout
    );
    this.toastr.success('Removed category to menu');
    this.fetchData();
  }

  showCategoryAdder() {
    this.isCategoryTypeaheadVisible = true;
  }

  private async fetchData() {
    const layoutIdAndConceptEnabled =
      await this.menuService.getDefaultLayoutIdAndConceptEnabled(
        this.locationId
      );
    this.defaultLayoutId = layoutIdAndConceptEnabled.defaultMenuLayoutId;
    this.conceptsEnabled = layoutIdAndConceptEnabled.conceptsEnabled;

    const result = await this.conceptService.getConcepts(this.locationId);
    this.concepts = result.concepts;
    this.activeConcept = this.concepts?.length > 0 ? this.concepts[0] : null;

    this.fetchMenuLayout();
  }

  private async fetchMenuLayout() {
    const layoutResponse = await this.menuService.getMenuLayout(
      this.locationId,
      this.currentMenuLayoutId
    );

    const categories = await this.menuService.getCategoriesForLayout(
      this.locationId,
      layoutResponse
    );

    this.allPOSCategories = await this.menuService.getAvailableCategories(
      this.locationId
    );

    this.allItems = await this.menuService.getItems(this.locationId);
    this.allCategories = categories;
    this.categories = categories;
    if (this.statusFilter == 1) {
      this.categories = this.categories.filter((category) => category.isActive);
    } else if (this.statusFilter == 2) {
      this.categories = this.categories.filter(
        (category) => !category.isActive
      );
    }
    this.layout = layoutResponse;

    this.loaded = true;
    this.cdr.detectChanges();
  }

  setActiveConceptId(id: ConceptVM) {
    this.activeConcept = id;
    this.fetchMenuLayout();
  }

  async drop(arr: MenuCategory[], event: CdkDragDrop<string[]>) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    const currentCategoryById = this.layout.categories.reduce(
      (accum, category) => {
        accum[category.categoryId] = category;
        return accum;
      },
      {} as { [categoryId: string]: MenuCategoryLayout }
    );

    this.layout = {
      ...this.layout,
      categories: arr.map((c) => currentCategoryById[c.id]),
    };

    await this.menuService.updateMenuLayout(
      this.locationId,
      this.currentMenuLayoutId,
      this.layout
    );
  }

  async onSortCategoryItems(data: any) {
    this.findCategoryAndUpdateSubCategories(this.layout.categories, data);
    await this.menuService.updateMenuLayout(
      this.locationId,
      this.currentMenuLayoutId,
      this.layout
    );
  }

  findCategoryAndUpdateSubCategories(categories: any, data: any) {
    categories.forEach((category: any) => {
      if (category.categoryId == data.parentCat.id) {
        if (data.type == 1) {
          // If sorting sub categories
          category.subCategories = data.subCat.map((s: any) => {
            return category.subCategories.find(
              (sub: any) => sub.categoryId == s.id
            );
          });
        } else {
          // else sorting items
          category.menuItemIds = data.subCat.map((s: any) => s.id);
        }
      } else {
        this.findCategoryAndUpdateSubCategories(category.subCategories, data);
      }
    });
  }

  openCategoryMap = new Map<string, boolean>();

  toggle(categoryId: string) {
    if (!this.categories) return;

    const selectedCategory = this.categories.find(
      (categories) => categories.id === categoryId
    );

    if (!selectedCategory) {
      return;
    }

    this.showMenuItems = !this.showMenuItems;
  }

  onClickEditMenuItem(locationId: string, event: any) {
    const menuItem = event.menuItem.id;
    this.router.navigate([
      'location',
      locationId,
      'kiosk-designer',
      'menu',
      'item',
      menuItem,
    ]);
  }

  getMenuItems(categoryId: string) {
    const selectedCategory = this.categories.find(
      (categories) => categories.id === categoryId
    );
    return selectedCategory ? selectedCategory.items : [];
  }

  ngOnInit(): void {
    this.fetchData();
    this.getLoyaltyLocationConfig();
  }
  async getLoyaltyLocationConfig() {
    let loyaltyConfiguration = await this.loyaltyService.getLocationConfig(
      this.locationId
    );
    if (loyaltyConfiguration) {
      this.isLoyaltyEnabled = loyaltyConfiguration.enabled;
    }
  }
  addMenuItemIdsToCategory(category: any, categoryId: string, item: MenuItem) {
    if (category.categoryId === categoryId) {
      return {
        ...category,
        menuItemIds: [...category.menuItemIds, item.id],
      };
    }

    if (category.subCategories) {
      const updatedSubcategories = category.subCategories.map(
        (subCategory: any) =>
          this.addMenuItemIdsToCategory(subCategory, categoryId, item)
      );

      return {
        ...category,
        subCategories: updatedSubcategories,
      };
    }

    return category;
  }

  async onClickAddItem(event: any) {
    let { category, item } = event;
    try {
      const updatedCategories = this.layout.categories.map((c) =>
        this.addMenuItemIdsToCategory(c, category.id, item)
      );

      this.layout = {
        ...this.layout,
        categories: updatedCategories,
      };

      await this.menuService.updateMenuLayout(
        this.locationId,
        this.currentMenuLayoutId,
        this.layout
      );

      this.toastr.success(`Item added to ${category.displayName}`);
    } catch {
      this.toastr.error(`Adding item to ${category.displayName} failed.`);
    }
  }

  async onClickRemoveItem(category: MenuCategory, event: any) {
    const menuItem = event.menuItem;
    const categoryName = event.category.displayName;
    try {
      this.layout = {
        ...this.layout,
        categories: this.layout.categories.map((c) => {
          const updatedSubCategories = c.subCategories.map((s) => {
            const updatedSubCategories = s.subCategories.map((nestedS) => {
              const updatedMenuItemIds = nestedS.menuItemIds.filter(
                (id) => id !== menuItem.id
              );
              return { ...nestedS, menuItemIds: updatedMenuItemIds };
            });
            const updatedMenuItemIds = s.menuItemIds.filter(
              (id) => id !== menuItem.id
            );
            return {
              ...s,
              menuItemIds: updatedMenuItemIds,
              subCategories: updatedSubCategories,
            };
          });
          const updatedMenuItemIds = c.menuItemIds.filter(
            (id) => id !== menuItem.id
          );
          return {
            ...c,
            menuItemIds: updatedMenuItemIds,
            subCategories: updatedSubCategories,
          };
        }),
      };

      // this.layout = {
      //   ...this.layout,
      //   categories: this.layout.categories.map((c) => {
      //     c.subCategories.map((s) => {
      //       s.menuItemIds = s.menuItemIds.filter((id) => id !== menuItem.id)
      //       if (s.categoryId === c.categoryId) {
      //         s.menuItemIds = s.menuItemIds.filter((id) => id !== menuItem.id)
      //       } else {
      //         return s;
      //       }
      //     });

      //     if (c.categoryId !== category.id) {
      //       return c;
      //     }

      //     return {
      //       ...c,
      //       menuItemIds: c.menuItemIds.filter((id) => id !== menuItem.id),
      //     };
      //   }),
      // };

      await this.menuService.updateMenuLayout(
        this.locationId,
        this.currentMenuLayoutId,
        this.layout
      );
      this.toastr.success(`Item removed from ${categoryName}`);
      const itemIndex = event.category.items.findIndex(
        (i: MenuItem) => i.id == event.menuItem.id
      );
      if (itemIndex > -1) {
        event.category.items.splice(itemIndex, 1);
        this.cdr.detectChanges();
      } else {
        location.reload();
      }
    } catch {
      this.toastr.error(`Removing item from ${categoryName} failed.`);
    }
  }

  async onClickColumnSelection(rowData: any) {
    try {
      this.layout = {
        ...this.layout,
        categories: this.layout.categories.map((c) => {
          c.subCategories.map((s) => {
            if (s.categoryId === rowData.category.id) {
              s.numberOfColumns = Number(rowData.column);
            } else {
              return s;
            }
          });

          if (c.categoryId !== rowData.category.id) {
            return c;
          }

          return {
            ...c,
            numberOfColumns: Number(rowData.column),
          };
        }),
      };

      await this.menuService.updateMenuLayout(
        this.locationId,
        this.currentMenuLayoutId,
        this.layout
      );
      this.toastr.success(`Column changed success.`);
    } catch {
      this.toastr.error(`Column changed failed.`);
    }
  }

  handleSearchChange(e: any) {
    const query = e.target.value.toLowerCase();
    this.reloadData(query);
  }
  reloadData(query = '') {
    this.categories =
      this.allCategories?.filter((category) => {
        return (
          category.posCategory?.name?.toLowerCase().includes(query) ||
          category.displayName.toLowerCase().includes(query)
        );
      }) ?? [];
    if (this.statusFilter == 1) {
      this.categories = this.categories.filter((category) => category.isActive);
    } else if (this.statusFilter == 2) {
      this.categories = this.categories.filter(
        (category) => !category.isActive
      );
    }
  }
  changeStatusFilter() {
    this.reloadData(this.searchQuery);
  }

  async onSetLoyaltyOnly(data: {
    category: MenuCategoryWithItems;
    loyaltyOnly: boolean;
    dropdownSelect: any;
  }) {
    const updatedCategories = this.layout.categories.map((c) =>
      c.categoryId == data.category.id
        ? { ...c, loyaltyOnly: data.loyaltyOnly }
        : c
    );
    this.layout = {
      ...this.layout,
      categories: updatedCategories,
    };
    data.dropdownSelect.selectedIndex = null;
    this.loader.start();
    await this.menuService.updateMenuLayout(
      this.locationId,
      this.currentMenuLayoutId,
      this.layout
    );
    this.toastr.success(`Category updated.`);
    this.loader.stop();
  }
}
