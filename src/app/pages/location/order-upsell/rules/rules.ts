import { OrderTypeTestVM, TestVM } from 'src/app/grubbrr/generated/common_pb';
import { OrderTypeRuleComponent } from './OrderType/order-type-rule/order-type-rule.component';
import { SectionsRuleComponent } from './Sections/sections-rule/sections-rule.component';

export enum RuleTypes {
  OrderTypeRule = 'Order Type',
  SectionsRule = 'Sections',
}

export class IModalConfiguration {
  locationId: string;
  tests?: TestVM[];
}
interface UpsellProvider {
  provide: typeof IModalConfiguration;
  useValue: IModalConfiguration;
}
export interface InjectableUpsellConfig {
  providers: UpsellProvider[];
}

export interface IModalResponse {
  success: boolean;
  RuleType?: RuleTypes;
  Payload?: OrderTypeTestVM | unknown;
}
