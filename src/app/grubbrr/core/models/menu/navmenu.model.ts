export interface NavMenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  subItems?: Array<NavMenuItem>;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
  isLayout?: boolean;
  roles?: Array<string>;
}
