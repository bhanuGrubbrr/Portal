import { SafeUrl } from '@angular/platform-browser';
export interface MenuBuilderModel {
  data: MenuBuilderData;
}

export interface MenuBuilderData {
  menuBuilder: MenuBuilder;
}

export interface MenuBuilder {
  menuCategories?: MenuCategory[];
  menuSections?: MenuSection[];
}

export interface MenuCategory {
  id: string;
  isActive: boolean;
  externalId: string;
  name: string;
  displayName: string;
  imageUrl?: null | string | SafeUrl;
  menuItemIds?: null | [];
  index: number;
  hasAlcohol: boolean;
  menuCategoryIds?: null | [];
}

export class MenuSection {
  id: string;
  name?: string;
}
