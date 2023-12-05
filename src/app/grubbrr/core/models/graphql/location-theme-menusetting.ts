import { MenuSettingModel } from './menusetting.model';
import { ThemeModel } from './theme.model';

export class LocationThemeMenuSetting {
  locationId: string;
  name: string;
  theme: ThemeModel;
  menuSetting: MenuSettingModel;
}
