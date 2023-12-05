export class CardNetworkModel {
  name: string;
  value: number;
}

// export class LocationTenderSettingModel {
//     defaultMapping: TenderDefinitionModel | null = null;
//     gratuityMapping: TenderDefinitionModel | null = null;
//     loyaltyPaymentTender: TenderDefinitionModel | null = null;
//     loyaltyDiscountTender: TenderDefinitionModel | null = null;
//     paymentMappings: TenderSettingsModel[];
//     creditCardNetworkMappings: TenderSettingsModel[];
//     discountMappings: TenderSettingsModel[];
// }
export enum TenderTypeId {
  None = 'None',
  Payment = 'Payment',
  Gratuity = 'Gratuity',
  CardNetworks = 'CardNetworks',
  Discount = 'Discount',
}

export class TenderMapping {
  requiredTenderType: TenderTypeId;
  tenderOptions: TenderDefinitionModel[];
}

// export class TenderDefinitionsModel {
//     tenders: TenderDefinitionModel[];
// }

export class TenderDefinitionModel {
  id: string;
  name: string;
}

// export class TenderSettingsModel {
//     type: string;
//     tender: TenderDefinitionModel;
// }
