export class DeviceDetails {
  serialNumber: string;
  deviceType: string;
  appVersion: string;
  lastLoginTime: Date;
}

export class KioskModel {
  kioskId: string;
  name: string;
  paymentIntegrationConfigs?: Record<string, Record<string, unknown>>;
  deviceDetails: DeviceDetails;
}
