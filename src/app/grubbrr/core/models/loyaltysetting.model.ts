import { FormFieldTypeModel } from './formfieldtype.model';

export class LoyaltySettingModel {
  loyaltyProvider: string;
  isActive: boolean;
  settings: { [key: string]: any };
}
