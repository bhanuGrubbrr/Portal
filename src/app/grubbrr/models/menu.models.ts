import * as menu_pb from '../generated/menu_pb';
import {
  OverrideAction,
  StringOverride,
  BoolOverride,
  IntOverride,
} from '../generated/common_pb';

export type CombinedMenuEntity<T> = {
  pos?: T;
  effective: T;
};

export interface CombinedMenus {
  menuSections: CombinedMenuEntity<menu_pb.MenuSection>[];
  menuItems: CombinedMenuEntity<menu_pb.MenuItem>[];
  modifierGroups: CombinedMenuEntity<menu_pb.ModifierGroup>[];
  modifiers: CombinedMenuEntity<menu_pb.Modifier>[];
}

export const isDefined = <T>(x: T | null): x is T => {
  return !!x;
};

export const groupByEffectiveId = <T extends { id: string }>(
  x: CombinedMenuEntity<T>
) => x.effective.id;

export const groupByPOSId = <T extends { id: string }>(
  x: CombinedMenuEntity<T>
) => x.pos?.id;

export const checkIsActive = <T extends { isActive: boolean }>(
  entity: T
): boolean => {
  return entity.isActive;
};

export const overrideFromOptional = <T>(
  setValue: T | null,
  revertValue: T
): {
  value: T;
  action: OverrideAction;
} => {
  if (setValue === null) {
    return {
      value: revertValue,
      action: OverrideAction.revert,
    };
  }

  return {
    value: setValue,
    action: OverrideAction.set,
  };
};

export const stringOverrideFromOptional = (
  optionalString: string | null
): StringOverride => {
  if (optionalString === null) {
    return {
      value: '',
      action: OverrideAction.revert,
    };
  }

  return {
    value: optionalString,
    action: OverrideAction.set,
  };
};

export const booleanOverrideFromOptional = (
  optionalBoolean: boolean | null
): BoolOverride => {
  if (optionalBoolean === null) {
    return {
      value: false,
      action: OverrideAction.revert,
    };
  }

  return {
    value: optionalBoolean,
    action: OverrideAction.set,
  };
};

export const intOverrideFromOptional = (
  optionalNumber: number | null
): IntOverride => {
  if (optionalNumber === null) {
    return {
      value: 0,
      action: OverrideAction.revert,
    };
  }

  return {
    value: optionalNumber,
    action: OverrideAction.set,
  };
};

export type MenuCategory = {
  id: string;
  displayName: string;
  media: string;
  isActive: boolean;
  posCategory: {
    name: string;
  } | null;
  numberOfColumns: number;
};

export type WithSubCategories = {
  subCategories: MenuCategoryWithItems[];
  // subCategories: MenuCategory[];
};

export const menuCategoryFromCombinedEntity = (
  combined: CombinedMenuEntity<menu_pb.MenuSection>
): MenuCategoryWithItemIds => {
  return {
    id: combined.effective.id,
    displayName: combined.effective.name,
    media: combined.effective.media ?? combined.pos?.media,
    isActive: combined.effective.isActive ?? combined.pos?.isActive,
    posCategory: combined.pos
      ? {
          name: combined.pos.name,
        }
      : null,
    itemIds: combined.effective.menuItemIds,
    numberOfColumns: 2,
  };
};

export type MenuDietaryAttribute = {
  name: string;
};

export type MenuCategoryWithItems = MenuCategory &
  WithSubCategories & {
    items: MenuItem[];
    itemIds: string[];
  };

export type MenuItem = {
  id: string;
  description: string;
  image: string | null;
  displayName: string;
  price: number;
  modifierSelectionMode: menu_pb.MenuItemDisplayFlow;
  isActive: boolean;
  modifierGroupIds?: string[];
  pos: {
    id: string;
    name: string;
  } | null;
  calorieText: string;
  selectedImage: string;
  selectedDisplayName: string;
};

export type MenuItemWithCategory = MenuItem & {
  categories: MenuCategory[];
};

export type MenuCategoryWithItemIds = MenuCategory & { itemIds: string[] };

export type MenuItemWithCategoryAndModifierGroups = MenuItemWithCategory & {
  modifierGroups: ModifierGroup[];
};

export type ModifierGroup = {
  id: string;
  name: string;
  displayName: string;
  selectMin: number;
  selectMax: number;
  isActive: boolean;
  hasPOSData: boolean;
};

export type Modifier = {
  menuItem: MenuItem;
  id: string;
  price: number;
  isDefault: boolean;
  maxQuantity: number;
  isInvisible: boolean;
};

export type UnsavedModifier = Omit<Modifier, 'id'>;

export type EditedModifier = {
  originalModifier: Modifier;
  displayName?: string | null;
  displayFlow?: menu_pb.MenuItemDisplayFlow | null;
  description?: string | null;
  isActive?: boolean | null;
  image?: File | string | null;
  isDefault?: boolean | null;
  maxQuantity?: number | null;
  isInvisible?: boolean | null;
  menuItemId?: string;
};

export type ModifierGroupWithModifiers = ModifierGroup & {
  modifiers: Modifier[];
  usedIn: MenuItem[];
  freeModifierCount: number;
};

export type CategoryMenuLayoutFormValues = {
  menuLayoutId: string;
  displayOrder: {
    order: 'before' | 'after' | null;
    categoryId: string | null;
  };
  items: MenuItem[];
  parentCategoryId: string | null;
};

export type CategorySaveData = {
  displayName?: string | null;
  isActive?: boolean | null;
  image?: File | null;
  items?: string[] | null;
  layoutData?: CategoryMenuLayoutFormValues[];
};

export type ModifierGroupSaveData = {
  selectMin?: number | null;
  selectMax?: number | null;

  name?: string | null;
  displayName?: string | null;
  displayFlow?: string | null;
  isActive?: boolean | null;
  modifiers?: (Modifier | UnsavedModifier)[] | null;
};

export const groupByGeneric = <T, U>(
  list: T[],
  getGroupingkey: (x: T) => number | string | undefined,
  transform: (input: T) => U
): { [id: string]: U } => {
  return list.reduce((grouped, item) => {
    const key = getGroupingkey(item);
    if (!key) {
      return grouped;
    }
    grouped[key] = transform(item);
    return grouped;
  }, {} as { [id: string]: U });
};

export const groupCategoriesByMenuItem = (menu: CombinedMenus) => {
  return menu!.menuSections.reduce((menuSectionMap, menuSection) => {
    for (let menuItemId of menuSection.effective.menuItemIds) {
      if (!menuSectionMap[menuItemId]) {
        menuSectionMap[menuItemId] = [];
      }

      menuSectionMap[menuItemId].push({
        ...menuSection.effective,
        displayName: menuSection.effective.name,
        posCategory: menuSection.pos?.name
          ? {
              name: menuSection.pos.name,
            }
          : null,
        numberOfColumns: 2,
      });
    }

    return menuSectionMap;
  }, {} as { [menuItemId: string]: MenuCategory[] });
};

export const identity = <T>(x: T) => x;

export type MenuEntities =
  | menu_pb.MenuSection
  | menu_pb.MenuItem
  | menu_pb.ModifierGroup
  | menu_pb.Modifier;

export const zipPOSAndEffective = <T extends MenuEntities>(
  posEntities: T[],
  effectiveEntities: T[]
): CombinedMenuEntity<T>[] => {
  const posItemsById = groupByGeneric(posEntities, (x) => x.id, identity);
  return effectiveEntities.map((entity) => {
    return {
      pos: posItemsById[entity.id],
      effective: entity,
    };
  });
};

export const transformMenuItemResponse = (
  effectiveMenuItem: menu_pb.MenuItem,
  posMenuItem: menu_pb.MenuItem | undefined
): MenuItem => {
  return {
    displayName: effectiveMenuItem.name,
    modifierSelectionMode: effectiveMenuItem.displayFlow,
    image: effectiveMenuItem.media[0],
    description: effectiveMenuItem.longDescription,
    isActive: effectiveMenuItem.isActive,
    price: effectiveMenuItem.price,
    id: effectiveMenuItem.id,
    modifierGroupIds: effectiveMenuItem.modifierGroupIds,
    pos: posMenuItem
      ? {
          id: effectiveMenuItem.id,
          name: posMenuItem.name,
        }
      : null,
    calorieText: effectiveMenuItem.calorieText,
    selectedImage: effectiveMenuItem.selectedImage,
    selectedDisplayName: effectiveMenuItem.selectedDisplayName,
  };
};

export const findParentCategoryId = (
  fullLayout: menu_pb.MenuLayout,
  categoryId: string
): string | null => {
  const childStack = [...fullLayout.categories];
  while (childStack.length) {
    const currentCategory = childStack.pop()!;
    const subIds = new Set(
      currentCategory.subCategories.map((c) => c.categoryId)
    );
    if (subIds.has(categoryId)) {
      return currentCategory.categoryId;
    }

    for (var childCategory of currentCategory.subCategories) {
      childStack.push(childCategory);
    }
  }

  return null;
};

export const isSavedModifier = (
  x: Modifier | UnsavedModifier
): x is Modifier => {
  return (x as Modifier).id !== undefined;
};
