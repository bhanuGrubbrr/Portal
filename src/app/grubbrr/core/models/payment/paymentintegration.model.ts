import { FormFieldTypeModel } from '../formfieldtype.model';
import { PaymentIntegrationDefinitionModel } from './paymentintegrationdefinition.model';

export class PaymentIntegrations {
  availablePaymentIntegrations: Array<PaymentIntegrationDefinitionModel>;
  configured: Array<PaymentIntegrationConfigModel>;
}

export class PaymentIntegrationConfigModel {
  tender: string;
  paymentIntegrationId: string;
  //orderChannels: Array<string>;
  settings: { [key: string]: FormFieldTypeModel };
}

// export class PaymentProviderSettingDto {
//   paymentIntegrationId: string;
//   fields: { [key: string]: any };
// }
// export class PaymentIntegrationConfig {
//   fields:{[key: string]:any}
// }
