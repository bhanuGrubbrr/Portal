import { FormFieldTypeModel } from './formfieldtype.model';

export class LoyaltyProviderModel {
  id: string;
  name: string;
  displayName: string;
  companyFields: { [key: string]: FormFieldTypeModel };
  locationFields: { [key: string]: FormFieldTypeModel };
}
