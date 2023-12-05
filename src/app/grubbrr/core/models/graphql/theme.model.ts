export class ThemeModel {
  themeId: string;
  locationId: string;
  name: string;
  settings: ThemeSettingsModel;
  kiosk: KioskSettingsModel;
  brank: BrandSettingsModel;
}

export class ThemeSettingsModel {
  public receipt: ReceiptCustomization;
}

export class KioskSettingsModel {
  public advanced: AdvancedCustomization;
  public display: DisplayCustomization;
  public homeScreen: HomeScreenCustomization;
}

export class AdvancedCustomization {
  adaHomeImage: {
    displayUrl: string;
    imagePath: string;
  };
  adaBackgroundColor: string;
  adaContrastColor: string;
  customLoyaltyLogo: {
    displayUrl: string;
    imagePath: string;
  };
  loyaltyBackgroundImage: {
    displayUrl: string;
    imagePath: string;
  };
  welcomeHeaderLoyaltyLogo: {
    displayUrl: string;
    imagePath: string;
  };
}

export class DisplayCustomization {
  confirmOrderModalImage: {
    displayUrl: string;
    imagePath: string;
  };
  confirmEmailModalImage: {
    displayUrl: string;
    imagePath: string;
  };
  cancelOrderModalImage: {
    displayUrl: string;
    imagePath: string;
  };
}

export class HomeScreenCustomization {
  concessionaireScreenBackgroundType: string;
  concessionaireBackgroundColor: string;
  concessionaireScreenBackgroundImage: {
    displayUrl: string;
    imagePath: string;
  };
  kioskBackgroundImage: {
    displayUrl: string;
    imagePath: string;
  };
  orderTypeUseTransparentButton: boolean;
  showChooseConcessionaireScreen: boolean;
  orderTypeBackgroundImage: {
    displayUrl: string;
    imagePath: string;
  };
  concessionaireLogoShape: string;
  orderTypeButtonColor: string;
}

export class BrandSettingsModel {
  AccentColor: string;
  BoldTextColor: string;
  BorderColor: string;
  CategoryBackgroundColor: string;
  CategorySidebarBackgroundColor: string;
  ColorCodeId: string;
  FooterOrderSummaryBackgroundColor: string;
  ItemPriceColor: string;
  NegativeButtonColor: string;
  NegativeButtonTextColor: string;
  PositiveButtonColor: string;
  PositiveButtonTextColor: string;
  PrimaryColor: string;
  SecondaryColor: string;
  TextColor: string;
}

export class ReceiptCustomization {
  emailReceiptBoldColor: string;
  emailReceiptButtonColor: string;
  emailReceiptHeaderColor: string;
  emailReceiptLogoImage: {
    displayUrl: string;
    imagePath: string;
  };
}
