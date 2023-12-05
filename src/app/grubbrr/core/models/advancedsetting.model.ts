export class AdvancedSettingModel {
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
  loyaltyBackgroundImage: {
    url: string;
  };
  customLoyaltyLogo: {
    url: string;
  };
  welcomeHeaderLoyaltyLogo: {
    url: string;
  };
  welcomeFooterText: string;
  adaHomeImage: {
    url: string;
  };
  adaBackgroundColor: string;
  adaContrastColor: string;
  printAllOrderItemsOnReceiptCustomer: boolean;
  printConcessionaireOrderItemsOnlyOnReceiptCustomer: boolean;
  printAllOrderItemsOnReceiptMerchant: boolean;
  printConcessionaireOrderItemsOnlyOnReceiptMerchant: boolean;
}
