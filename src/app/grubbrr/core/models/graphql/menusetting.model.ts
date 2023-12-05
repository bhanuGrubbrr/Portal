import { OrderTypeOptionModel } from '../order-type-option.model';
import { screenSaver } from '../screensaver.model';

export class LocationMenuSettingModel {
  menuSetting: MenuSettingModel;
}

export class MenuSettingModel {
  menuSettingId: string;
  locationId: string;
  name: string;
  kiosk: KioskSettingsModel;
  receipt: ReceiptSettingsModel;
}

export class KioskSettingsModel {
  public advanced: KioskAdvancedSettingsModel;
  public display: KioskDisplaySettingsModel;
  public general: KioskGeneralSettingsModel;
  public homeScreen: KioskHomeScreenSettingsModel;
}

export class KioskAdvancedSettingsModel {
  enableLoyalty: boolean;
  enableDynamicPickupTime: boolean;
  hideZReport: boolean;
  enableConcessionaireMode: boolean;
  enableMachineLearingUpsell: boolean;
  enableADA: boolean;
  allowCustomerOptInMarketingEmails: boolean;
  enableBarCodeReader: boolean;
  enableCashRecycler: boolean;
  allowLoyaltyRewardsZeroAmount: boolean;
  loyaltyWelcomeFooterText: string;
  printAllOrderItemsOnReceiptCustomer: boolean;
  printConcessionaireOrderItemsOnlyOnReceiptCustomer: boolean;
  printAllOrderItemsOnReceiptMerchant: boolean;
  printConcessionaireOrderItemsOnlyOnReceiptMerchant: boolean;
}
export class KioskDisplaySettingsModel {
  specialRequestHeaderText: string;
  specialRequestButtonText: string;
  customerNameInfoHeader: string;
  customerNameInfoHint: string;
  customerPhoneInfoHint: string;
  customerEmailInfoHint: string;
  orderTableTentHeaderText: string;
  orderTableTentTitle: string;
  orderTableTentBodyText: string;
  orderTableTentNumberText: string;
  itemTableTentHeaderText: string;
  itemTableTentBodyText: string;
  itemTableTentSpecialRequestText: string;
  confirmOrderModalHeaderText: string;
  confirmOrderModalSecondaryText: string;
  confirmOrderModalMainText: string;
  confirmEmailModalHeaderText: string;
  confirmEmailModalSecondaryText: string;
  confirmEmailModalMainText: string;
  confirmEmailModalFinishText: string;
  tipModalHeaderText: string;
  tipModalMainText: string;
  upsellModalHeaderText: string;
  upsellModalMainText: string;
}
export class KioskGeneralSettingsModel {
  orderTypeOptions: OrderTypeOptionModel[];
  allowPurchaseOfGiftCards: boolean;
  showAvailableInventory: boolean;
  showCurrencyPrefix: boolean;
  showCalorieCount: boolean;
  hideStartsAtVariablePriced: boolean;
  minimizeSpacingBetweenItems: boolean;
  showItemTagImages: boolean;
  idCheckAlcoholItem: boolean;
  builderMode: boolean;
  enableItemSpecialRequest: boolean;
  showNegativeCustomizations: boolean;
  showDefaultCustomizations: boolean;
  itemHideCustomizationSelections: boolean;
  allowAddItemToCartForCustomizationsGroup86: boolean;
  includeTaxInPrice: boolean;
  hideItemLineTaxCheckoutScreen: boolean;
  upChargeOnCreditCardPayments: boolean;
  upChargeOnCreditCardPaymentsIsPercentage: boolean;
  upChargeOnCreditCardPaymentsAmount: number;
  askForTip: boolean;
  presetTips: presetTip[];
  returningCustomers: boolean;
  showPaymentScreen: boolean;
  generalTimeout: number;
  checkoutTimeout: number;
}
export class KioskHomeScreenSettingsModel {
  enableHomeScreen: boolean;
  enableRestaurantLogo: boolean;
  homeScreenWelcomeCenterMessage: string;
  homeScreenWelcomeBottomMessage: string;
  storeClosedTimeMessage: string;
  screenSavers: screenSaver[];
}

export class ReceiptSettingsModel {
  public printOrderToken: boolean;
  public printTokenAndCustomerReceiptTogether: boolean;
  public showModifiers: boolean;
  public onlyShowPremiumModifiers: boolean;
  public showQRCodeForCounterPayment: boolean;
  public customizeMessageHeaderText: string;
  public customizeMessageFooterText: string;
  public timeDurationForKOTPrintRetry: number;
  public showModifierGroupName: boolean;
  public showPaymentType: boolean;
  public showPaidNotPaid: boolean;
  public commaSeperatedModifiers: boolean;
  public kotFooterMessage: string;
  public emailReceiptHeaderText: string;
  public emailReceiptPhoneNumber: string;
  public emailReceiptWebsiteUrl: string;
  public emailReceiptButtonText: string;
  public emailReceiptFooterText: string;
  public sendSMSReceipt: boolean;
  public messageTextBeforeLink: string;
  public messageTextAfterLink: string;
}

export class presetTip {
  isDefault: boolean;
  tipIsPercentage: boolean;
  tipPercentageOrAmount: number;
}
