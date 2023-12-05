declare module namespace {}

export interface PropertyChange {
  property: string;
  prev: string;
  new: string;
}

export interface CategoryChange {
  id: string;
  name: string;
  type: string;
  propertyChanges: PropertyChange[];
}

export interface MenuItemChange {
  id: string;
  name: string;
  propertyChanges: PropertyChange[];
}

export interface MenuChanges {
  isFullImport: boolean;
  addedCategories: CategoryChange[];
  updatedCategories: CategoryChange[];
  removedCategories: CategoryChange[];
  addedMenuItems: CategoryChange[];
  updatedMenuItems: CategoryChange[];
  removedMenuItems: CategoryChange[];
  addedModifierGroups: CategoryChange[];
  updatedModifierGroups: CategoryChange[];
  removedModifierGroups: CategoryChange[];
  addedModifiers: CategoryChange[];
  updatedModifiers: CategoryChange[];
  removedModifiers: CategoryChange[];
  addedAltItemValueLists: CategoryChange[];
  updatedAltItemValueLists: any[];
  removedAltItemValueLists: any[];
}

export class SyncRecord {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  message?: string;
  menuChanges: MenuChanges;
  snapshotId: string | null;
}

export class MenuSync {
  syncRecords: SyncRecord[];
  moreAvailable: boolean;
  continuationToken: string;
}
