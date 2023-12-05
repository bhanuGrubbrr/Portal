import { PaymentIntegrationDefinitionModel } from '../payment/paymentintegrationdefinition.model';

class CompanyModel {
  public formatAddress = () => {
    return `${this.address.address1}, ${this.address.city}, ${this.address.state}, ${this.address.countryISO}`;
  };

  companyId: string;
  companyName: string;
  businessEmail: {
    email: string;
  };
  businessContactNo: {
    number: string;
  };
  businessLogo: {
    displayUrl: string;
    imagePath: string;
  };
  businessType: string;
  alternativeContactNo: {
    number: string;
  };
  designation: string;
  isFranchiseBusiness: boolean;
  dateFormat: string;
  currencyId: string;
  countryName: string;
  address: {
    address1: string;
    address2: string;
    countryISO: string;
    state: string;
    city: string;
    zipCode: string;
  };
  locationCoordinates: {
    Latitude: string;
    Longitude: string;
  };
  timeZoneId: string;
  tagLine: string;
  noOfBranches: number;
  productSeller: string;
  activeDates: {
    StartDate: string;
    EndDate: string;
  };
  footer: string;
  packageID: number;
  sellingPrice: number;
  isDemoVersion: boolean;
  versionCode: number;
  squareAppDetailID: string;
  ipAddress: string;
  enabledPaymentIntegrations: PaymentIntegrationDefinitionModel[];
}

export { CompanyModel };
