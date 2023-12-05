import { TenderMappingMode } from 'src/app/core/global-constants';
import { FormFieldTypeModel } from './formfieldtype.model';
import { posConnectorMode } from './PosConnectorMode';

export class PosTypeModel {
  posIntegrationId: string;
  displayName: string;
  vendor: string;
  integrationVersion: string;
  requiredTenderTypes: string[];
  fields: { [key: string]: FormFieldTypeModel };
  mode: posConnectorMode;
  assemblyName: string;
  isCloudIntegration: boolean;
  tenderMappingMode: TenderMappingMode;
  integrationUrl: string;
}
