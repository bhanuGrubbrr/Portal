import { DayOfWeekVM } from 'src/app/grubbrr/generated/common_pb';

export class LocationModel {
  formatAddress = () => {
    return `${this.storeLocation.address.address1}, ${this.storeLocation.address.city}, ${this.storeLocation.address.state}, ${this.storeLocation.address.countryISO}`;
  };

  locationId: string;
  companyId: string;
  timezone: string;
  name: string;
  //slug: string;
  homeScreenLogo: {
    displayUrl: string;
    imagePath: string;
  };
  logo: {
    displayUrl: string;
    imagePath: string;
  };
  ownerInfo: OwnerInfoModel;
  storeLocation: StoreLocationModel;
  contactInfo: ContactInfoModel;
  locationInheritance: {
    parentLocationId: any;
    inheritMenu: boolean;
    inheritKioskSettings: boolean;
  };
  footer: string;
  tagLine: string;
  isFranchise: boolean;
  hasConcesionaries: boolean;
  prefix: string;
  //  squareFeet: number;
  activeDates: {
    StartDate: string;
    EndDate: string;
  };

  // workingDays: string[];
  // kioskThemeId: string;
  // onlineOrderingThemeId: string;
  // kioskMenuSettingId: string;
  // onlineOrderingMenuSettingId: string;
  //paymentSettings: PaymentSettingsModel;
}

export interface StoreLocationModel {
  address: {
    address1: string;
    address2: string;
    countryISO: string;
    state: string;
    city: string;
    zipCode: string;
  };
  countryName: string;
  locationCoordinates: {
    Latitude: string;
    Longitude: string;
  };
  timeZoneId: string;
  region: string;
}
export interface OwnerInfoModel {
  ownerEmail: {
    email: string;
  };
  ownerCompanyName: string;
  ownerName: string;
  ownerContactNo: {
    number: string;
  };
  ownerProfilePic: {
    displayUrl: string;
    imagePath: string;
  };
}

export interface ContactInfoModel {
  contactNo: {
    number: string;
  };
  customerSupportno: {
    number: string;
  };
  locationEmail: {
    email: string;
  };
  customerSupportEmail: {
    email: string;
  };
}

export interface BusinessHoursModel {
  day: DayOfWeekVM;
  selected: boolean;
  hours: HourModel[];
}

export interface HourModel {
  from: Date;
  to: Date;
}
