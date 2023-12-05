import { screenSaver } from './screensaver.model';
export class HomeScreenSettingsModel {
  enableHomeScreen: boolean;
  enableRestaurantLogo: boolean;
  homeScreenWelcomeCenterMessage: string;
  homeScreenWelcomeBottomMessage: string;
  screenSavers: screenSaver[];
  buttonColor: string;
  useTransparentButton: boolean;
  backgroundImage: {
    url: string;
  };
  showChooseConcessionaireScreen: boolean;
  concessionaireLogoShape: string;
  concessionaireScreenBackground: string;
  concessionaireBackgroundImage: {
    url: string;
  };
  concessionaireBackgroundColor: string;
}
