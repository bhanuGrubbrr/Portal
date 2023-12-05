import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { MenuServiceClient } from '../generated/menuService_pb.client';
import { grpcTransport } from './grpc/transport';
import * as menu_pb from '../generated/menu_pb';
import { EmptyResponse, OverrideAction } from '../generated/common_pb';
import { ImageService } from './image.service';
import { KioskConfigService } from './kioskConfig.service';
import {
  CombinedMenus,
  isDefined,
  groupByEffectiveId,
  groupByPOSId,
  checkIsActive,
  overrideFromOptional,
  stringOverrideFromOptional,
  booleanOverrideFromOptional,
  intOverrideFromOptional,
  MenuCategory,
  menuCategoryFromCombinedEntity,
  MenuDietaryAttribute,
  MenuCategoryWithItems,
  MenuItem,
  MenuItemWithCategory,
  MenuCategoryWithItemIds,
  MenuItemWithCategoryAndModifierGroups,
  ModifierGroup,
  Modifier,
  ModifierGroupWithModifiers,
  CategoryMenuLayoutFormValues,
  CategorySaveData,
  ModifierGroupSaveData,
  groupByGeneric,
  groupCategoriesByMenuItem,
  identity,
  zipPOSAndEffective,
  transformMenuItemResponse,
  WithSubCategories,
  UnsavedModifier,
} from '../models/menu.models';
import {
  CategoryStatusOverrideBulkRequest,
  CategoryStatusOverrideVM,
  MenuItemStatusOverrideBulkRequest,
  MenuItemStatusOverrideVM,
  ModiferGroupStatusOverrideVM,
  ModifierGroupModifierOverride,
  ModifierGroupStatusOverrideBulkRequest,
} from '../generated/menuService_pb';
// TODO: Update imports to use the model file directly and remove this
export {
  CombinedMenus,
  isDefined,
  groupByEffectiveId,
  groupByPOSId,
  checkIsActive,
  overrideFromOptional,
  stringOverrideFromOptional,
  booleanOverrideFromOptional,
  intOverrideFromOptional,
  MenuCategory,
  menuCategoryFromCombinedEntity,
  MenuDietaryAttribute,
  MenuCategoryWithItems,
  MenuItem,
  MenuItemWithCategory,
  MenuCategoryWithItemIds,
  MenuItemWithCategoryAndModifierGroups,
  ModifierGroup,
  Modifier,
  ModifierGroupWithModifiers,
  CategoryMenuLayoutFormValues,
  CategorySaveData,
  ModifierGroupSaveData,
  groupByGeneric,
  groupCategoriesByMenuItem,
  identity,
  zipPOSAndEffective,
  transformMenuItemResponse,
} from '../models/menu.models';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuCache = new Map<string, menu_pb.MenuResponse>();
  private currencyDivisor: number | undefined;

  constructor(
    private imageService: ImageService,
    private kioskConfigService: KioskConfigService
  ) {}

  async get_client() {
    return new MenuServiceClient(grpcTransport());
  }

  public async getFullMenu(locationId: string): Promise<CombinedMenus> {
    const { menu, currencyDivisor } = await this.fetchMenu(locationId);
    const adjustPriceForCurrencyDivisor = <T extends { price: number }>(
      x: T
    ): T => {
      return {
        ...x,
        price: x.price / currencyDivisor,
      };
    };

    const combined: CombinedMenus = {
      menuSections: zipPOSAndEffective(
        menu.rawMenu!.menuSections,
        menu.effectiveMenu!.menuSections
      ),
      menuItems: zipPOSAndEffective(
        menu.rawMenu!.menuItems.map(adjustPriceForCurrencyDivisor),
        menu.effectiveMenu!.menuItems.map(adjustPriceForCurrencyDivisor)
      ),
      modifierGroups: zipPOSAndEffective(
        menu.rawMenu!.modifierGroups,
        menu.effectiveMenu!.modifierGroups
      ),
      modifiers: zipPOSAndEffective(
        menu.rawMenu!.modifiers.map(adjustPriceForCurrencyDivisor),
        menu.effectiveMenu!.modifiers.map(adjustPriceForCurrencyDivisor)
      ),
    };

    return combined;
  }

  async getMenu(locationId: string): Promise<menu_pb.MenuResponse> {
    const result = await this.fetchMenu(locationId);
    return result.menu;
  }

  private async getCurrencyDivisor(locationId: string): Promise<number> {
    if (this.currencyDivisor) {
      return this.currencyDivisor;
    }

    this.currencyDivisor = await this.kioskConfigService.getCurrencyDivisor(
      locationId
    );
    return this.currencyDivisor!;
  }

  private async fetchMenu(
    locationId: string
  ): Promise<{ menu: menu_pb.MenuResponse; currencyDivisor: number }> {
    const currencyDivisor = await this.getCurrencyDivisor(locationId);
    const cached = this.menuCache.get(locationId);
    if (cached) {
      return {
        menu: cached,
        currencyDivisor,
      };
    }

    const client = await this.get_client();
    const result = await client.getEffectiveMenu({ locationId });

    this.menuCache.set(locationId, result.response!);

    return {
      menu: result.response!,
      currencyDivisor,
    };
  }

  async getDefaultLayoutIdAndConceptEnabled(locationId: string) {
    const res = await this.kioskConfigService.getKioskConfig(locationId);
    return {
      defaultMenuLayoutId: res.defaultMenuLayoutId,
      conceptsEnabled: res.conceptsEnabled,
    };
  }

  async GetMessageGuards(
    locationId: string
  ): Promise<menu_pb.MessageGuardResponse> {
    const client = await this.get_client();
    const result = await client.getMessageGuards({ locationId });
    return result.response;
  }

  async CreateMessageGuard(
    locationId: string,
    messageGuard: menu_pb.MessageGuardVM
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.createMessageGuard({
      locationId,
      messageGuard,
    });
    return result.response;
  }

  async DeleteMessageGuard(
    locationId: string,
    id: string
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.removeMessageGuard({
      locationId,
      id,
    });
    return result.response;
  }

  async UpdateMessageGuard(
    locationId: string,
    messageGuard: menu_pb.MessageGuardVM
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.updateMessageGuard({
      locationId,
      messageGuard,
    });
    return result.response;
  }

  async RemoveMessageGuard(
    locationId: string,
    id: string
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.removeMessageGuard({ locationId, id });
    return result.response;
  }

  async GetItem86List(locationId: string): Promise<menu_pb.Item86Response> {
    const client = await this.get_client();
    const result = await client.getItem86List({ locationId });

    return result.response;
  }
  async UpdateItem86List(
    locationId: string,
    ids: string[]
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.updateItem86List({ locationId, ids });

    return result.response;
  }

  public resetMenuCacheForLocation(locationId: string) {
    this.menuCache.delete(locationId);
  }

  async updateCategoryStatusBulk(
    locationId: string,
    categoryRecords: Record<string, boolean>[]
  ) {
    const client = await this.get_client();
    let categoryStatusOverrideBulkRequest =
      {} as CategoryStatusOverrideBulkRequest;
    categoryStatusOverrideBulkRequest.categoryStatusOverrides = [];

    const categoryOverride: CategoryStatusOverrideVM[] = categoryRecords.map(
      (record) => ({
        categoryId: record.id.toString(),
        isActive:
          record.isActive === undefined
            ? {
                oneofKind: undefined,
              }
            : {
                oneofKind: 'isActiveOverride',
                isActiveOverride: booleanOverrideFromOptional(record.isActive),
              },
      })
    );

    categoryStatusOverrideBulkRequest.categoryStatusOverrides.push(
      ...categoryOverride
    );
    categoryStatusOverrideBulkRequest.locationId = locationId;

    await client.updateCategoryStatusOverrideBulkRequest(
      categoryStatusOverrideBulkRequest
    );
    this.resetMenuCacheForLocation(locationId);
  }

  async updateCategory(
    locationId: string,
    categoryId: string,
    { displayName, isActive, image, items, layoutData }: CategorySaveData
  ) {
    const client = await this.get_client();
    let imagePath: string | undefined | null = undefined;
    if (image && image instanceof File) {
      imagePath = await this.uploadImage(locationId, image);
    } else if (image === null) {
      imagePath = null;
    }

    await client.updateCategoryOverride({
      locationId,
      categoryId,
      name:
        displayName === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'nameOverride',
              nameOverride: stringOverrideFromOptional(displayName),
            },
      imagePath:
        imagePath === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'imagePathOverride',
              imagePathOverride: stringOverrideFromOptional(imagePath),
            },
      menuItemIds:
        items === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'menuItemIdsOverride',
              menuItemIdsOverride: overrideFromOptional(items, []),
            },
      isActive:
        isActive === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'isActiveOverride',
              isActiveOverride: booleanOverrideFromOptional(isActive),
            },
    });

    if (layoutData) {
      await this.saveCategoryForLayouts(
        locationId,
        categoryId,
        layoutData,
        true
      );
    }

    this.resetMenuCacheForLocation(locationId);
  }

  private async saveCategoryForLayouts(
    locationId: string,
    categoryId: string,
    layoutData: CategoryMenuLayoutFormValues[],
    isEdit: boolean = false
  ) {
    for (let layoutSaveData of layoutData) {
      const currentLayout = await this.getMenuLayout(
        locationId,
        layoutSaveData.menuLayoutId
      );

      const newParentCategoryId = layoutSaveData.parentCategoryId;
      const newMenuItemIds = layoutSaveData.items.map((i) => i.id);
      const selectedCategory = currentLayout.categories.find(
        (c) => c.categoryId == categoryId
      );
      let editedCategoryIndex: number = 0;
      const removeCategoryFromLayout = (
        categoryLayout: menu_pb.MenuLayout['categories']
      ) => {
        // find the parent, remove it from its old parent, and add it if it is being added as a sub-category
        for (let categoryIndex in categoryLayout) {
          const category = categoryLayout[categoryIndex];

          // remove from the current category
          if (category.categoryId === categoryId) {
            editedCategoryIndex = parseInt(categoryIndex);
            categoryLayout.splice(Number(categoryIndex), 1);
            return;
          }

          removeCategoryFromLayout(category.subCategories);
        }
      };

      removeCategoryFromLayout(currentLayout.categories);

      const addCategoryToLayout = (
        categoryLayout: menu_pb.MenuLayout['categories']
      ) => {
        for (let category of categoryLayout) {
          if (category.categoryId === newParentCategoryId) {
            category.subCategories.push({
              categoryId,
              menuItemIds: newMenuItemIds,
              subCategories: selectedCategory?.subCategories ?? [],
              numberOfColumns: selectedCategory?.numberOfColumns ?? 2,
              loyaltyOnly: selectedCategory?.loyaltyOnly ?? false,
            });
            return;
          }

          addCategoryToLayout(category.subCategories);
        }
      };

      if (newParentCategoryId === null || newParentCategoryId === 'null') {
        let updatedCategory = {
          categoryId,
          menuItemIds: newMenuItemIds,
          subCategories: selectedCategory?.subCategories ?? [],
          numberOfColumns: selectedCategory?.numberOfColumns ?? 2,
          loyaltyOnly: selectedCategory?.loyaltyOnly ?? false,
        };
        if (isEdit) {
          currentLayout.categories.splice(
            editedCategoryIndex,
            0,
            updatedCategory
          );
        } else {
          currentLayout.categories.push(updatedCategory);
        }
      } else {
        addCategoryToLayout(currentLayout.categories);
      }

      await this.updateMenuLayout(
        locationId,
        layoutSaveData.menuLayoutId,
        currentLayout
      );
      // if (layout.displayOrder.order && layout.displayOrder.categoryId) {
      //   if (currentIndex !== -1) {
      //     currentLayout.categories.splice(currentIndex, 1);
      //   }

      //   const pivotIndex = currentLayout.categories.findIndex(
      //     (c) => c.categoryId === layout.displayOrder.categoryId
      //   );
      //   if (pivotIndex === -1) {
      //     console.log(
      //       `Unable to find category ${layout.displayOrder.categoryId} to use to place category ${categoryId}`
      //     );
      //     continue;
      //   }

      //   const offset = layout.displayOrder.order === 'before' ? -1 : 1;
      //   currentLayout.categories.splice(pivotIndex + offset, 0, {
      //     categoryId,
      //     menuItemIds,
      //     subCategories: [],
      //   });

      //   await this.updateMenuLayout(
      //     locationId,
      //     layout.menuLayoutId,
      //     currentLayout
      //   );
      // }
    }
  }

  async createCategory(
    locationId: string,
    categoryId: string,
    { displayName, isActive, image, items, layoutData }: CategorySaveData
  ) {
    const client = await this.get_client();
    let imagePath: string | undefined | null = undefined;
    if (image && image instanceof File) {
      imagePath = await this.uploadImage(locationId, image);
    } else if (image === null) {
      imagePath = null;
    }

    const createResponse = await client.createCategory({
      locationId,
      categoryId,
      name:
        displayName === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'nameOverride',
              nameOverride: stringOverrideFromOptional(displayName),
            },
      imagePath:
        imagePath === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'imagePathOverride',
              imagePathOverride: stringOverrideFromOptional(imagePath),
            },
      menuItemIds:
        items === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'menuItemIdsOverride',
              menuItemIdsOverride: overrideFromOptional(items, []),
            },
      isActive:
        isActive === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'isActiveOverride',
              isActiveOverride: booleanOverrideFromOptional(isActive),
            },
    });

    if (layoutData) {
      await this.saveCategoryForLayouts(
        locationId,
        createResponse.response.id,
        layoutData
      );
    }

    this.resetMenuCacheForLocation(locationId);
  }

  async updateModifier(
    locationId: string,
    originalModifier: Modifier,
    {
      displayName,
      isActive,
      image,
      displayFlow,
      description,
      isDefault,
      maxQuantity,
      isInvisible,
    }: {
      displayName?: string | null;
      displayFlow?: menu_pb.MenuItemDisplayFlow | null;
      description?: string | null;
      isActive?: boolean | null;
      image?: File | string | null;
      isDefault?: boolean | null;
      maxQuantity?: number | null;
      isInvisible?: boolean | null;
    }
  ) {
    const client = await this.get_client();
    let imagePath: string | undefined | null = undefined;
    if (image && image instanceof File) {
      imagePath = await this.uploadImage(locationId, image);
    } else if (image === null) {
      imagePath = null;
    }
    await client.updateModifierOverride({
      locationId,
      modifierId: originalModifier.id,
      fields: {
        isDefault:
          isDefault === undefined
            ? {
                oneofKind: undefined,
              }
            : {
                oneofKind: 'isDefaultOverride',
                isDefaultOverride: booleanOverrideFromOptional(isDefault),
              },
        maxQuantity:
          maxQuantity === undefined
            ? {
                oneofKind: undefined,
              }
            : {
                oneofKind: 'maxQuantityOverride',
                maxQuantityOverride: intOverrideFromOptional(maxQuantity),
              },
        isInvisible:
          isInvisible === undefined
            ? {
                oneofKind: undefined,
              }
            : {
                oneofKind: 'isInvisibleOverride',
                isInvisibleOverride: booleanOverrideFromOptional(isInvisible),
              },
      },
    });

    await client.updateModifierMenuItemOverride({
      locationId,
      menuItemId: originalModifier.menuItem.id,
      name:
        displayName === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'nameOverride',
              nameOverride: stringOverrideFromOptional(displayName),
            },
      displayFlow:
        displayFlow === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'displayFlowOverride',
              displayFlowOverride: overrideFromOptional(
                displayFlow,
                menu_pb.MenuItemDisplayFlow.Default
              ),
            },
      imagePath:
        imagePath === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'imagePathOverride',
              imagePathOverride: stringOverrideFromOptional(imagePath),
            },
      description:
        description === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'descriptionOverride',
              descriptionOverride: stringOverrideFromOptional(description),
            },
      modifierGroupIds: {
        oneofKind: undefined,
      },
      isActive:
        isActive === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'isActiveOverride',
              isActiveOverride: booleanOverrideFromOptional(isActive),
            },
    });

    this.resetMenuCacheForLocation(locationId);
  }

  async removeModifierGroupFromItem(
    locationId: string,
    menuItemId: string,
    modifierGroupId: string
  ) {
    const currentItem = await this.getItem(locationId, menuItemId);
    const newModifierGroupIds = currentItem.modifierGroupIds!.filter(
      (mgId) => mgId !== modifierGroupId
    );
    await this.updateMenuItem(locationId, menuItemId, {
      modifierGroupIds: newModifierGroupIds,
    });
  }

  async addModifierGroupToItem(
    locationId: string,
    menuItemId: string,
    modifierGroupId: string
  ) {
    const currentItem = await this.getItem(locationId, menuItemId);
    const newModifierGroupIds =
      currentItem.modifierGroupIds!.concat(modifierGroupId);
    await this.updateMenuItem(locationId, menuItemId, {
      modifierGroupIds: newModifierGroupIds,
    });
  }

  async removeCategoryFromItem(
    locationId: string,
    categoryId: string,
    menuItemId: string
  ) {
    const currentItem = await this.getCategory(locationId, categoryId);
    const newItemIds = currentItem
      .items!.map((i) => i.id)
      .filter((id) => id !== menuItemId);
    await this.updateCategory(locationId, categoryId, {
      items: newItemIds,
    });
  }

  async addCategoryToItem(
    locationId: string,
    categoryId: string,
    menuItemId: string
  ) {
    const currentItem = await this.getCategory(locationId, categoryId);
    const newItemIds = currentItem.items!.map((i) => i.id).concat(menuItemId);
    await this.updateCategory(locationId, categoryId, {
      items: newItemIds,
    });
  }

  async updateMenuItem(
    locationId: string,
    menuItemId: string,
    {
      displayName,
      calorieText,
      isActive,
      image,
      displayFlow,
      description,
      modifierGroupIds,
      selectedImage,
      selectedDisplayName,
    }: {
      displayName?: string | null;
      calorieText?: string | null;
      displayFlow?: menu_pb.MenuItemDisplayFlow | null;
      description?: string | null;
      isActive?: boolean | null;
      image?: File | string | null;
      modifierGroupIds?: string[] | null;
      selectedImage?: File | string | null;
      selectedDisplayName?: string | null;
    }
  ) {
    const client = await this.get_client();
    let imagePath: string | undefined | null = undefined;
    if (image && image instanceof File) {
      imagePath = await this.uploadImage(locationId, image);
    } else if (image === null) {
      imagePath = null;
    }

    let selectedImagePath: string | undefined | null = undefined;
    if (selectedImage && selectedImage instanceof File) {
      selectedImagePath = await this.uploadImage(locationId, selectedImage);
    } else if (selectedImage === null) {
      selectedImagePath = null;
    }

    await client.updateMenuItemOverride({
      locationId,
      menuItemId,
      name:
        displayName === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'nameOverride',
              nameOverride: stringOverrideFromOptional(displayName),
            },
      calorieText:
        calorieText === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'calorieTextOverride',
              calorieTextOverride: stringOverrideFromOptional(calorieText),
            },
      displayFlow:
        displayFlow === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'displayFlowOverride',
              displayFlowOverride: overrideFromOptional(
                displayFlow,
                menu_pb.MenuItemDisplayFlow.Default
              ),
            },
      imagePath:
        imagePath === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'imagePathOverride',
              imagePathOverride: stringOverrideFromOptional(imagePath),
            },
      description:
        description === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'descriptionOverride',
              descriptionOverride: stringOverrideFromOptional(description),
            },
      modifierGroupIds:
        modifierGroupIds === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'modifierGroupIdsOverride',
              modifierGroupIdsOverride: overrideFromOptional(
                modifierGroupIds,
                []
              ),
            },
      isActive:
        isActive === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'isActiveOverride',
              isActiveOverride: booleanOverrideFromOptional(isActive),
            },
      selectedImagePath:
        selectedImagePath === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'selectedImagePathOverride',
              selectedImagePathOverride:
                stringOverrideFromOptional(selectedImagePath),
            },
      selectedDisplayName:
        selectedDisplayName === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'selectedDisplayNameOverride',
              selectedDisplayNameOverride:
                stringOverrideFromOptional(selectedDisplayName),
            },
    });

    this.resetMenuCacheForLocation(locationId);
  }

  async updateMenuItemStatusBulk(
    locationId: string,
    menuItemRecords: Record<string, boolean>[]
  ) {
    const client = await this.get_client();
    let menuItemStatusOverrideBulkRequest =
      {} as MenuItemStatusOverrideBulkRequest;
    menuItemStatusOverrideBulkRequest.menuItemStatusOverrides = [];

    const menuItemOverride: MenuItemStatusOverrideVM[] = menuItemRecords.map(
      (record) => ({
        menuItemId: record.id.toString(),
        isActive:
          record.isActive === undefined
            ? {
                oneofKind: undefined,
              }
            : {
                oneofKind: 'isActiveOverride',
                isActiveOverride: booleanOverrideFromOptional(record.isActive),
              },
      })
    );

    menuItemStatusOverrideBulkRequest.menuItemStatusOverrides.push(
      ...menuItemOverride
    );
    menuItemStatusOverrideBulkRequest.locationId = locationId;

    await client.updateMenuItemStatusOverrideBulk(
      menuItemStatusOverrideBulkRequest
    );
    this.resetMenuCacheForLocation(locationId);
  }

  async addOrRemoveMenuItemFromCategoriesInLayout(
    locationId: string,
    menuLayoutId: string,
    menuItemId: string,
    categoriesToKeep: MenuCategory[]
  ) {
    const categoriesToAssociateWith = new Set(
      categoriesToKeep.map((c) => c.id)
    );
    const currentLayout = await this.getMenuLayout(locationId, menuLayoutId);
    currentLayout.categories.forEach((category) => {
      const currentMenuItemIds = new Set(category.menuItemIds);

      // if the user wants to assoc this category with this item and the category does not already contain it, add it
      if (
        categoriesToAssociateWith.has(category.categoryId) &&
        !currentMenuItemIds.has(menuItemId)
      ) {
        category.menuItemIds.push(menuItemId);
        // conversly if the user DOES NOT want to assoc this category with this item and the category does contain it, remove it
      } else if (
        !categoriesToAssociateWith.has(category.categoryId) &&
        currentMenuItemIds.has(menuItemId)
      ) {
        category.menuItemIds = category.menuItemIds.filter(
          (mi) => mi !== menuItemId
        );
      }
    });

    await this.updateMenuLayout(locationId, menuLayoutId, currentLayout);
  }

  async createModifierGroup(
    locationId: string,
    {
      name,
      displayName,
      isActive,
      displayFlow,
      selectMax,
      selectMin,
      modifiers,
    }: ModifierGroupSaveData
  ) {
    const client = await this.get_client();

    const createResponse = await client.createModifierGroup({
      locationId,
      modifierGroupId: '',
      name:
        name === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'nameOverride',
              nameOverride: stringOverrideFromOptional(name),
            },
      displayName:
        displayName === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'displayNameOverride',
              displayNameOverride: stringOverrideFromOptional(displayName),
            },
      displayFlow:
        displayFlow === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'displayFlowOverride',
              displayFlowOverride: stringOverrideFromOptional(displayFlow),
            },
      selectMin:
        selectMin === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'selectMinOverride',
              selectMinOverride: intOverrideFromOptional(selectMin),
            },
      selectMax:
        selectMax === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'selectMaxOverride',
              selectMaxOverride: intOverrideFromOptional(selectMax),
            },
      modifiers:
        modifiers === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'modifiersOverride',
              modifiersOverride: {
                value: modifiers!.map((modifier) =>
                  this.getModifierOverrideRequest(modifier)
                ),
                action: OverrideAction.set,
              },
            },
      isActive:
        isActive === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'isActiveOverride',
              isActiveOverride: booleanOverrideFromOptional(isActive),
            },
    });

    this.resetMenuCacheForLocation(locationId);
    return createResponse;
  }

  async updateModifierGroupStatusBulk(
    locationId: string,
    modifierGroupRecords: Record<string, boolean>[]
  ) {
    const client = await this.get_client();
    let modifierGroupStatusOverrideBulkRequest =
      {} as ModifierGroupStatusOverrideBulkRequest;
    modifierGroupStatusOverrideBulkRequest.modiferGroupOverrides = [];

    const modifierGroupOverride: ModiferGroupStatusOverrideVM[] =
      modifierGroupRecords.map((record) => ({
        modifierGroupId: record.id.toString(),
        isActive:
          record.isActive === undefined
            ? {
                oneofKind: undefined,
              }
            : {
                oneofKind: 'isActiveOverride',
                isActiveOverride: booleanOverrideFromOptional(record.isActive),
              },
      }));

    modifierGroupStatusOverrideBulkRequest.modiferGroupOverrides.push(
      ...modifierGroupOverride
    );
    modifierGroupStatusOverrideBulkRequest.locationId = locationId;

    await client.updateModifierGroupStatusOverrideBulk(
      modifierGroupStatusOverrideBulkRequest
    );
    this.resetMenuCacheForLocation(locationId);
  }

  async updateModifierGroup(
    locationId: string,
    modifierGroupId: string,
    {
      name,
      displayName,
      isActive,
      displayFlow,
      selectMax,
      selectMin,
      modifiers,
    }: ModifierGroupSaveData
  ) {
    const client = await this.get_client();

    await client.updateModifierGroupOverride({
      locationId,
      modifierGroupId,
      displayName:
        displayName === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'displayNameOverride',
              displayNameOverride: stringOverrideFromOptional(displayName),
            },
      name:
        name === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'nameOverride',
              nameOverride: stringOverrideFromOptional(name),
            },
      displayFlow:
        displayFlow === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'displayFlowOverride',
              displayFlowOverride: stringOverrideFromOptional(displayFlow),
            },
      selectMin:
        selectMin === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'selectMinOverride',
              selectMinOverride: intOverrideFromOptional(selectMin),
            },
      selectMax:
        selectMax === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'selectMaxOverride',
              selectMaxOverride: intOverrideFromOptional(selectMax),
            },
      modifiers:
        modifiers === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'modifiersOverride',
              modifiersOverride: {
                value: modifiers!.map((modifier) =>
                  this.getModifierOverrideRequest(modifier)
                ),
                action: OverrideAction.set,
              },
            },
      isActive:
        isActive === undefined
          ? {
              oneofKind: undefined,
            }
          : {
              oneofKind: 'isActiveOverride',
              isActiveOverride: booleanOverrideFromOptional(isActive),
            },
    });

    this.resetMenuCacheForLocation(locationId);
  }

  async getPOSVaultCategories(
    locationId: string
  ): Promise<MenuCategoryWithItemIds[]> {
    const client = await this.get_client();
    const resp = await client.getPosVault({
      locationId,
    });

    return resp.response.menu?.menuSections.map((s) => {
      return {
        id: s.id,
        media: s.media,
        isActive: s.isActive,
        displayName: s.name,
        itemIds: s.menuItemIds,
        posCategory: {
          name: s.name,
        },
        numberOfColumns: 2,
      };
    })!;
  }

  async getCategoriesForLayout(
    locationId: string,
    layout: menu_pb.MenuLayout
    // ): Promise<(MenuCategoryWithItems & { itemIds: string[] })[]> {
  ): Promise<(MenuCategoryWithItems & WithSubCategories)[]> {
    const menu = await this.getFullMenu(locationId);

    const categoriesById = groupByGeneric(
      menu.menuSections,
      groupByEffectiveId,
      identity
    );

    const menuItemsById = groupByGeneric(
      menu.menuItems,
      groupByEffectiveId,
      (combined) => transformMenuItemResponse(combined.effective, combined.pos)
    );

    const transformCategory = (
      category: menu_pb.MenuCategoryLayout
    ): (MenuCategoryWithItems & WithSubCategories) | null => {
      const categoryRecord = categoriesById[category.categoryId];
      if (!categoryRecord) {
        return null;
      }

      const { effective } = categoryRecord;
      return {
        id: effective.id,
        media: effective.media,
        isActive: effective.isActive,
        displayName: effective.name,
        posCategory: {
          name: effective.name,
        },
        itemIds: category.menuItemIds,
        items: category.menuItemIds.map((i) => menuItemsById[i]),
        subCategories: category.subCategories
          .map((c) => transformCategory(c))
          .filter(isDefined),
        numberOfColumns:
          category?.numberOfColumns > 0 && category?.numberOfColumns < 4
            ? category.numberOfColumns
            : 2,
      };
    };

    const categories = layout.categories
      .map((category): (MenuCategoryWithItems & WithSubCategories) | null => {
        return transformCategory(category);
      })
      .filter(isDefined);

    return categories;
  }

  async getItemsForLayout(
    locationId: string,
    layout: menu_pb.MenuLayout
  ): Promise<MenuItem[]> {
    const menu = await this.getFullMenu(locationId);
    const menuItemsById = groupByGeneric(
      menu.menuItems,
      groupByEffectiveId,
      identity
    );

    return layout.menuItems.map((mi): MenuItem => {
      const menuItem = menuItemsById[mi.menuItemId];
      return transformMenuItemResponse(menuItem.effective, menuItem.pos);
    });
  }

  async getMenuLayout(
    locationId: string,
    menuLayoutId: string
  ): Promise<menu_pb.MenuLayout> {
    const client = await this.get_client();
    const layout = await client.getMenuLayout({
      locationId,
      menuLayoutId,
    });

    return layout.response.layout!;
  }

  async updateMenuLayout(
    locationId: string,
    menuLayoutId: string,
    layoutToUpdate: menu_pb.MenuLayout
  ) {
    const client = await this.get_client();
    await client.updateMenuLayout({
      locationId,
      name: layoutToUpdate.name,
      layout: {
        ...layoutToUpdate,
        menuLayoutId,
      },
    });
  }

  async getCategoriesWithItems(
    locationId: string,
    activeOnly: boolean = false
  ): Promise<MenuCategoryWithItems[]> {
    const menu = await this.getFullMenu(locationId);

    const menuItemsById = groupByGeneric(
      menu!.menuItems,
      (x) => x.effective.id,
      (combined): MenuItem => {
        return transformMenuItemResponse(combined.effective, combined.pos);
      }
    );

    const result = menu!.menuSections.map(
      (composite): MenuCategoryWithItems => {
        const s = composite.effective;
        const pos: any = composite.pos;
        let items = s.menuItemIds
          .map((i): MenuItem | null => {
            const menuItem = menuItemsById[i];
            if (!menuItem) {
              console.log('Invalid menu item reference found: ' + i);
              return null;
            }

            return menuItem;
          })
          .filter(isDefined);

        if (activeOnly) {
          items = items.filter(checkIsActive);
        }

        return {
          id: s.id,
          media: s.media,
          isActive: s.isActive,
          displayName: s.name,
          posCategory: {
            name: pos?.name ?? s.name,
          },
          items,
          itemIds: s.menuItemIds,
          numberOfColumns: 2,
          subCategories: [],
        };
      }
    );

    if (activeOnly) {
      return result.filter(checkIsActive);
    }

    return result;
  }

  async uploadImage(locationId: string, image: File): Promise<string> {
    const newFileName = `${image.name.substring(
      image.name.lastIndexOf('.') + 1
    )}`;

    const formData = new FormData();
    formData.append('file', image, newFileName);

    const handler = this.imageService.uploadImages(locationId, formData);
    const uploadRes = await lastValueFrom(handler);
    const path = Object.values(uploadRes)[0];
    return path;
  }

  async getCategories(locationId: string): Promise<MenuCategory[]> {
    const menu = await this.getFullMenu(locationId);
    return menu.menuSections.map(menuCategoryFromCombinedEntity);
  }

  async getAvailableCategories(
    locationId: string
  ): Promise<MenuCategoryWithItemIds[]> {
    const menu = await this.getFullMenu(locationId);
    return menu.menuSections.map(menuCategoryFromCombinedEntity);
  }

  async getPOSCategories(locationId: string): Promise<menu_pb.MenuSection[]> {
    const client = await this.get_client();
    const result = await client.getEffectiveMenu({ locationId });
    return result.response.rawMenu!.menuSections;
  }

  async getCategory(
    locationId: string,
    categoryId: string
  ): Promise<MenuCategoryWithItems> {
    const combinedMenu = await this.getCategoriesWithItems(locationId);
    const category = combinedMenu.find(
      (category) => category.id === categoryId
    );
    if (!category) {
      throw new Error('No category found with ID: ' + categoryId);
    }

    return category;
  }

  async getModifiers(locationId: string): Promise<Modifier[]> {
    const menu = await this.getFullMenu(locationId);

    const menuItemsById = groupByGeneric(
      menu!.menuItems,
      (x) => x.effective.id,
      (combined) => transformMenuItemResponse(combined.effective, combined.pos)
    );
    console.log('menu.modifiers', menu.modifiers);
    return menu.modifiers.map((modifier): Modifier => {
      console.log(`MODIFIER`, modifier);
      return {
        menuItem: menuItemsById[modifier.effective.menuItemId],
        id: modifier.effective.id,
        price: modifier.effective.price,
        isDefault: modifier.effective.isDefault,
        maxQuantity: modifier.effective.maxQuantity,
        isInvisible: modifier.effective.isInvisible,
      };
    });
  }

  async getItems(locationId: string): Promise<MenuItemWithCategory[]> {
    const layoutIdAndConceptEnabled =
      await this.getDefaultLayoutIdAndConceptEnabled(locationId);

    const layoutResponse = await this.getMenuLayout(
      locationId,
      layoutIdAndConceptEnabled.defaultMenuLayoutId
    );
    const menu = await this.getFullMenu(locationId);

    //Updates the effective MenuItemIds from layout document under location under
    menu!.menuSections.map((composite) => {
      const s = composite.effective;
      const pos: any = composite.pos;
      var layoutCategory = layoutResponse.categories.find(
        (x) => x.categoryId == composite.effective.id
      );
      if (layoutCategory) {
        composite.effective.menuItemIds = layoutCategory.menuItemIds;
      }
    });

    const categoriesByMenuItemId = groupCategoriesByMenuItem(menu);

    return menu!.menuItems.map((i) => {
      return {
        ...transformMenuItemResponse(i.effective, i.pos),
        categories: categoriesByMenuItemId[i.effective.id] ?? [],
      };
    });
  }

  async getDietaryAttributes(): Promise<MenuDietaryAttribute[]> {
    return [
      {
        name: 'Gluten-free',
      },
      {
        name: 'Vegan',
      },
    ];
  }

  async getModifier(locationId: string, modifierId: string): Promise<Modifier> {
    const menu = await this.getFullMenu(locationId);
    const modifier = menu!.modifiers.find(
      (menuItem) => menuItem.effective.id === modifierId
    );
    if (!modifier) {
      throw new Error('No modifier found for ID: ' + modifierId);
    }

    const menuItemsById = groupByGeneric(
      menu!.menuItems,
      (x) => x.effective.id,
      identity
    );

    return {
      ...modifier.effective,
      menuItem: transformMenuItemResponse(
        menuItemsById[modifier.effective.menuItemId].effective,
        menuItemsById[modifier.effective.menuItemId].pos
      ),
    };
  }

  async getItem(
    locationId: string,
    menuItemId: string
  ): Promise<MenuItemWithCategoryAndModifierGroups> {
    const menu = await this.getFullMenu(locationId);
    const menuItem = menu!.menuItems.find(
      (menuItem) => menuItem.effective.id === menuItemId
    );
    if (!menuItem) {
      throw new Error('No item found for ID: ' + menuItemId);
    }

    const menuItemCategoryMap = groupCategoriesByMenuItem(menu);
    const modifierGroups = groupByGeneric(
      menu.modifierGroups,
      (mg) => mg.effective.id,
      (modifierGroup): ModifierGroup => {
        return {
          ...modifierGroup.effective,
          displayName: modifierGroup.effective.name,
          hasPOSData: !!modifierGroup.pos,
        };
      }
    );

    return {
      ...transformMenuItemResponse(menuItem.effective, menuItem.pos),
      categories: menuItemCategoryMap[menuItem.effective.id] ?? [],
      modifierGroups: menuItem.effective.modifierGroupIds
        .map((mgId): ModifierGroup | null => {
          const referencedModifierGroup = modifierGroups[mgId];
          if (!referencedModifierGroup) {
            console.log(
              'Invalid modifier group reference: ' + referencedModifierGroup
            );
            return null;
          }

          return referencedModifierGroup;
        })
        .filter(isDefined),
    };
  }

  async getPOSModifierGroup(
    locationId: string,
    modifierGroupId: string
  ): Promise<ModifierGroupWithModifiers | null> {
    const menu = await this.getFullMenu(locationId);
    const modifierGroup = menu!.modifierGroups.find(
      (mg) => mg.pos?.id === modifierGroupId
    );

    if (!modifierGroup || !modifierGroup.pos) {
      return null;
    }

    const menuItemsByModifierGroupId = menu!.menuItems.reduce(
      (modifierGroupMap, menuItem) => {
        if (!menuItem.pos) {
          return modifierGroupMap;
        }
        for (let modifierGroupId of menuItem.pos.modifierGroupIds) {
          if (!modifierGroupMap[modifierGroupId]) {
            modifierGroupMap[modifierGroupId] = [];
          }

          modifierGroupMap[modifierGroupId].push(
            transformMenuItemResponse(menuItem.pos, menuItem.pos)
          );
        }

        return modifierGroupMap;
      },
      {} as { [modifierGroupId: string]: MenuItem[] }
    );

    const menuItemsById = groupByGeneric(
      menu.menuItems,
      groupByPOSId,
      identity
    );
    const modifierMenuItemsById = groupByGeneric(
      menu.modifiers,
      groupByPOSId,
      (modifier) =>
        transformMenuItemResponse(
          menuItemsById[modifier.effective.menuItemId].effective,
          menuItemsById[modifier.pos!.menuItemId].pos
        )
    );
    const modifiersById = groupByGeneric(
      menu.modifiers,
      groupByPOSId,
      (modifier): Modifier | null => {
        const menuItem = modifierMenuItemsById[modifier.pos?.id!];
        if (!menuItem) {
          console.log(`Failed to look up ${modifier.pos?.menuItemId}`);
          return null;
        }

        return {
          ...modifier.effective,
          menuItem,
        };
      }
    );

    return {
      ...modifierGroup.pos!,
      displayName: modifierGroup.pos!.name,
      modifiers: modifierGroup
        .pos!.modifierIds.map((modifierId): Modifier | null => {
          const modifier = modifiersById[modifierId];
          if (!modifier) {
            return null;
          }

          return modifier;
        })
        .filter(isDefined),
      usedIn: menuItemsByModifierGroupId[modifierGroup.effective.id] ?? [],
      hasPOSData: !!modifierGroup.pos,
    };
  }

  async getModifierGroup(
    locationId: string,
    modifierGroupId: string
  ): Promise<ModifierGroupWithModifiers> {
    const menu = await this.getFullMenu(locationId);
    const modifierGroup = menu!.modifierGroups.find(
      (mg) => mg.effective.id === modifierGroupId
    );
    if (!modifierGroup) {
      throw new Error('No modifier group found for ID: ' + modifierGroupId);
    }

    const menuItemsByModifierGroupId = menu!.menuItems.reduce(
      (modifierGroupMap, menuItem) => {
        for (let modifierGroupId of menuItem.effective.modifierGroupIds) {
          if (!modifierGroupMap[modifierGroupId]) {
            modifierGroupMap[modifierGroupId] = [];
          }

          modifierGroupMap[modifierGroupId].push(
            transformMenuItemResponse(menuItem.effective, menuItem.pos)
          );
        }

        return modifierGroupMap;
      },
      {} as { [modifierGroupId: string]: MenuItem[] }
    );

    const menuItemsById = groupByGeneric(
      menu.menuItems,
      groupByEffectiveId,
      identity
    );
    const modifierMenuItemsById = groupByGeneric(
      menu.modifiers,
      groupByEffectiveId,
      (modifier) =>
        menuItemsById[modifier.effective.menuItemId] &&
        transformMenuItemResponse(
          menuItemsById[modifier.effective.menuItemId].effective,
          menuItemsById[modifier.effective.menuItemId].pos
        )
    );
    const modifiersById = groupByGeneric(
      menu.modifiers,
      groupByEffectiveId,
      (modifier): Modifier | null => {
        const menuItem = modifierMenuItemsById[modifier.effective.id];
        if (!menuItem) {
          console.log(`Failed to look up ${modifier.effective.menuItemId}`);
          return null;
        }

        return {
          ...modifier.effective,
          menuItem,
        };
      }
    );

    return {
      ...modifierGroup.effective,
      displayName:
        (modifierGroup.effective.displayName || null) ??
        modifierGroup.effective.name,
      modifiers: modifierGroup.effective.modifierIds
        .map((modifierId): Modifier | null => {
          const modifier = modifiersById[modifierId];
          if (!modifier) {
            console.log(`Failed to look up modifier ${modifierId}`);
            return null;
          }

          return modifier;
        })
        .filter(isDefined),
      usedIn: menuItemsByModifierGroupId[modifierGroup.effective.id] ?? [],
      hasPOSData: !!modifierGroup.pos,
    };
  }

  async getUniqueModifiers(locationId: string) {
    let modifierGroups = await this.getModifierGroups(locationId);

    const seenMenuItemIds = new Set();
    const menuItems: MenuItem[] = [];
    for (const modifierGroup of modifierGroups) {
      for (const modifier of modifierGroup.modifiers) {
        if (seenMenuItemIds.has(modifier.menuItem.id)) continue;

        seenMenuItemIds.add(modifier.menuItem.id);
        menuItems.push(modifier.menuItem);
      }
    }

    return menuItems;
  }

  async getModifierGroups(
    locationId: string
  ): Promise<ModifierGroupWithModifiers[]> {
    const menu = await this.getFullMenu(locationId);
    const menuItemsById = groupByGeneric(
      menu.menuItems,
      groupByEffectiveId,
      (menuItem): MenuItem => {
        return transformMenuItemResponse(menuItem.effective, menuItem.pos);
      }
    );

    const menuItemsByModifierGroupId = menu.menuItems.reduce(
      (modifierGroupMap, menuItem) => {
        for (let modifierGroupId of menuItem.effective.modifierGroupIds) {
          if (!modifierGroupMap[modifierGroupId]) {
            modifierGroupMap[modifierGroupId] = [];
          }

          modifierGroupMap[modifierGroupId].push(
            menuItemsById[menuItem.effective.id]
          );
        }

        return modifierGroupMap;
      },
      {} as { [modifierGroupId: string]: MenuItem[] }
    );

    const modifiersById = groupByGeneric(
      menu.modifiers,
      groupByEffectiveId,
      (modifier): Modifier | null => {
        const menuItem = menuItemsById[modifier.effective.menuItemId];
        if (!menuItem) {
          console.log(
            'Invalid menu item reference in modifier ID: ' +
              modifier.effective.id
          );
          return null;
        }

        return {
          ...modifier.effective,
          menuItem,
        };
      }
    );

    return menu!.modifierGroups.map((mg) => {
      return {
        ...mg.effective,
        name: mg.pos?.name ?? mg.effective.name,
        displayName: mg.effective.displayName,
        modifiers: mg.effective.modifierIds
          .map((modifierId): Modifier | null => {
            const modifierMenuItem = modifiersById[modifierId];
            if (!modifierMenuItem) {
              return null;
            }

            return modifierMenuItem;
          })
          .filter(isDefined),
        usedIn: menuItemsByModifierGroupId[mg.effective.id] ?? [],
        hasPOSData: !!mg.pos,
      };
    });
  }

  // async updateModifierGroupWithModifierAndMenuItemsOverrides(
  //   locationId: string,
  //   modifierGroupId: string,
  //   modifierGroup: ModifierGroupSaveData,
  //   editedModifiers: EditedModifier[]
  // ) {
  //   let modWithMenuItemOverrideRequest: ModifierWithMenuItemOverrideRequest[] =
  //     [];

  //   for (const modifier of editedModifiers) {
  //     let imagePath: string | undefined | null = undefined;
  //     if (modifier.image && modifier.image instanceof File) {
  //       imagePath = await this.uploadImage(locationId, modifier.image);
  //     } else if (modifier.image === null) {
  //       imagePath = null;
  //     }

  //     let modifierRequest: ModifierOverrideRequest =
  //       this.getModifierOverrideRequest(locationId, modifier);

  //     let modifierMenuItemOverrideReq: ModifierMenuItemOverrideRequest =
  //       this.getModifierMenuItemOverrideRequest(
  //         locationId,
  //         imagePath,
  //         modifier
  //       );

  //     let modWithMenuItemsOverrideReq: ModifierWithMenuItemOverrideRequest = {
  //       modifierOverrideRequest: modifierRequest,
  //       modifierMenuItemOverrideRequest: modifierMenuItemOverrideReq,
  //     };
  //     modWithMenuItemOverrideRequest.push(modWithMenuItemsOverrideReq);
  //   }

  //   try {
  //     const client = await this.get_client();
  //     await client.updateModifierGroupWithModifiersAndMenuItemOverride(
  //       modifierGroupWithModifierRequest
  //     );
  //   } catch (error) {
  //     throw error;
  //   } finally {
  //     this.resetMenuCacheForLocation(locationId);
  //   }
  //   this.resetMenuCacheForLocation(locationId);
  // }

  private getOneOfKindUndefined() {
    return {
      oneofKind: undefined,
    };
  }

  private getModifierOverrideRequest(
    modifier: Modifier | UnsavedModifier
  ): ModifierGroupModifierOverride {
    return {
      menuItemId: modifier.menuItem.id,
      fields: {
        isDefault:
          modifier.isDefault === undefined
            ? this.getOneOfKindUndefined()
            : {
                oneofKind: 'isDefaultOverride',
                isDefaultOverride: booleanOverrideFromOptional(
                  modifier.isDefault
                ),
              },
        maxQuantity:
          modifier.maxQuantity === undefined
            ? this.getOneOfKindUndefined()
            : {
                oneofKind: 'maxQuantityOverride',
                maxQuantityOverride: intOverrideFromOptional(
                  modifier.maxQuantity
                ),
              },
        isInvisible:
          modifier.isInvisible === undefined
            ? this.getOneOfKindUndefined()
            : {
                oneofKind: 'isInvisibleOverride',
                isInvisibleOverride: booleanOverrideFromOptional(
                  modifier.isInvisible
                ),
              },
      },
    };
  }
}

export class SyncStatus {
  status: string;
  lastSynced: Date;
  message: string;
}
