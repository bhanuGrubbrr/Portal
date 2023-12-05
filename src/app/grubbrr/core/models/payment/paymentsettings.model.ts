import { PaymentOptionModel } from './paymentoption.model';

export class PaymentSettingsModel {
  inStorePayments: PaymentOptionModel[];
  onlinePayments: PaymentOptionModel[];
}
