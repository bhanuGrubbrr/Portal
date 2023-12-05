export class ReceiptCustomizationModel {
  printOrderToken: boolean;
  printTokenAndCustomerReceiptTogether: boolean;
  showModifiers: boolean;
  onlyShowPremiumModifiers: boolean;
  showQRCodeForCounterPayment: boolean;
  customizeMessageHeaderText: string;
  customizeMessageFooterText: string;
  timeDurationForKOTPrintRetry: number;
  showModifierGroupName: boolean;
  showPaymentType: boolean;
  showPaidNotPaid: boolean;
  commaSeperatedModifiers: boolean;
  kotFooterMessage: string;
  emailReceiptLogoImage: {
    url: string;
  };
  emailReceiptHeaderColor: string;
  emailReceiptBoldColor: string;
  emailReceiptButtonColor: string;
  emailReceiptHeaderText: string;
  emailReceiptPhoneNumber: string;
  emailReceiptWebsiteUrl: string;
  emailReceiptButtonText: string;
  emailReceiptFooterText: string;
  sendSMSReceipt: boolean;
  messageTextBeforeLink: string;
  messageTextAfterLink: string;
}
