import { KioskSettingsModel } from '../../core/models/kiosksettings.model';

export type KioskSettingQuery = {
  kioskSettings: KioskSettingsModel;
};

export type LocationGraphVariables = {
  locationId?: string;
};
