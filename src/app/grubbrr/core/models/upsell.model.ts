import { MenuItem, MenuSection } from '../../generated/menu_pb';

export interface UpsellSection {
  object: MenuSection;
  type: 'category';
}

export interface UpsellItem {
  object: MenuItem;
  type: 'item';
}
