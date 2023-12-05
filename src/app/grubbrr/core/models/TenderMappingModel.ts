import { TenderMappingMode } from 'src/app/core/global-constants';
import { FormFieldTypeModel } from './formfieldtype.model';

export class TenderMappingModel {
  posTypeName: string;
  tenderMappingMode: string;
  showTenderMappingUI: boolean;
  defaultMapping: TenderMappingField;
  gratuityMapping: TenderMappingField;
  paymentMappings: TenderMappingField[];
  discountMappings: TenderMappingField[];
  creditCardNetworkMappings: TenderMappingField[];
  gratuityMappings: TenderMappingField[];
}

export class TenderMappingField {
  label: string;
}
