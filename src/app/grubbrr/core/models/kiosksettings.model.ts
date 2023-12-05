import { AdvancedSettingModel } from './advancedsetting.model';
import { DisplayCustomizationModel } from './displaycustomization.model';
import { GeneralSettingModel } from './generalsetting.model';
import { HomeScreenSettingsModel } from './homescreensettings.model';
import { ReceiptCustomizationModel } from './graphql/receiptcustomization.model';

export class KioskSettingsModel {
  locationId: string;
  generalSettings: GeneralSettingModel;
  advancedSettings: AdvancedSettingModel;
  homeScreenSettings: HomeScreenSettingsModel;
  displayCustomization: DisplayCustomizationModel;
  receiptCustomization: ReceiptCustomizationModel;
}
