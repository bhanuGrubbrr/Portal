import { UserDetailsModel } from '../grubbrr/core/models/userdetails.model';

export enum MenuTypeEnum {
  Admin = 1,
  Customer = 2,
  Location = 3,
}

export class GlobalConstants {
  public static menuTypeEnum: MenuTypeEnum = MenuTypeEnum.Admin;
  public static Offset = new Date().getTimezoneOffset();
}

export enum KioskTabEnum {
  General = 1,
  Advanced = 2,
  Home = 3,
  Display = 4,
  Receipt = 5,
}

export enum PageEnum {
  AdminHome = '/admin/company',
  CompanyHome = '/company',
  NoCompanyAccess = '/noaccess',
  //UserMe = '/user/me',
  //Login = '/',
}

export enum Features {
  Company = 'Company',
  All = 'All',
}

export enum Roles {
  None = 'None',
  User = 'User',
  Admin = 'Admin',
}

export class FeatureRoles {
  feature: Features;
  permission: Roles;
}

export enum CompanyImageTypeEnum {
  BusinessLogo = 1,
  OwnerImage = 2,
}

export enum LocationImageTypeEnum {
  Logo = 1,
  HomeScreenLogo = 2,
}

export enum KioskImageTypeEnum {
  // Advanced Images
  LoyaltyBackground = 1,
  CustomLoyalty = 2,
  WelcomeHeaderLoyalty = 3,
  adaHomeImage = 4,
  // Home Screen Images
  KioskBackgroundImage = 12,
  ScreenSaver = 5,
  OrderTypeBackground = 6,
  ConcessionaireBackgroundImage = 7,
  // Receipt Images
  EmailReceiptLogoImage = 8,
  // Display Images
  ConfirmOrderModalImage = 9,
  ConfirmEmailModalImage = 10,
  CancelOrderModalImage = 11,
}

export enum PaymentCategory {
  Instore = 'In Store',
  Online = 'Online',
  Other = 'Other',
}

export enum TenderMappingMode {
  'None',
  'PaymentTypes',
  'CardNetworks',
  'Loyalty',
}

export const NoChangesMessage = 'Imported menu, no changes detected';
export const DATE_FORMAT = 'MM/dd/yyyy';

export enum PopupPlacement {
  TopLeft = 'topleft',
  TopCenter = 'topcenter',
  TopRight = 'topright',
}
