import { FormFieldTypeModel } from '../formfieldtype.model';

export class PaymentIntegrationDefinitionModel {
  paymentIntegrationId: string;
  displayName: string;
  paymentMethod: string;
  locationFields: { [key: string]: FormFieldTypeModel };
  kioskFields: { [key: string]: FormFieldTypeModel };
}
