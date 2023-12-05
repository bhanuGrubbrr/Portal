export class PaymentGrid {
  constructor(
    displayName: string,
    paymentIntegrationId: string,
    isSetup: boolean,
    hasSetupFields: boolean,
    paymentMethod: string
  ) {
    this.displayName = displayName;
    this.paymentIntegrationId = paymentIntegrationId;
    this.isSetup = isSetup;
    this.hasSetupFields = hasSetupFields;
    this.paymentMethod = paymentMethod;
  }

  displayName: string;
  paymentIntegrationId: string;
  isSetup: boolean;
  hasSetupFields: boolean;
  paymentMethod: string;
}
