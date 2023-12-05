import { Injectable } from '@angular/core';
import { CompanyService } from './company.service';
import { LocationService } from './location.service';
import { KioskConfigService } from './kioskConfig.service';

export type LocationFeatures = {
  conceptsEnabled: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class LocationIdService {
  // Cache / Dictionary
  static locationNames: { [key: string]: string };
  static companieNames: { [key: string]: string };
  static locationToCompany: { [key: string]: string };

  constructor(
    private locationService: LocationService,
    private companyService: CompanyService,
    private kioskConfigService: KioskConfigService
  ) {
    LocationIdService.companieNames = {};
    LocationIdService.locationNames = {};
    LocationIdService.locationToCompany = {};
  }

  public IsLocationId(scopeId: string): boolean {
    return scopeId.startsWith('loc-');
  }

  // Companies
  public async GetCompanyName(companyId: string): Promise<string> {
    if (!LocationIdService.companieNames[companyId]) {
      const company = await this.companyService.getCompany(companyId);
      LocationIdService.companieNames[companyId] = company.companyName;
    }
    return LocationIdService.companieNames[companyId];
  }

  public async GetCompanyIdFromLocationId(locationId: string): Promise<string> {
    if (!LocationIdService.locationToCompany[locationId]) {
      await this.fetchLocation(locationId);
    }

    return LocationIdService.locationToCompany[locationId];
  }

  // Locations
  public async GetLocationName(locationId: string): Promise<string> {
    if (!LocationIdService.locationNames[locationId]) {
      await this.fetchLocation(locationId);
    }

    return LocationIdService.locationNames[locationId];
  }

  public async getKioskFeatureStatus(
    locationId: string
  ): Promise<LocationFeatures> {
    const config = await this.kioskConfigService.getKioskConfig(locationId);

    return {
      conceptsEnabled: config.conceptsEnabled,
    };
  }

  private async fetchLocation(locationId: string): Promise<void> {
    let summary = await this.locationService.getLocationSummary(locationId);

    LocationIdService.locationNames[locationId] = summary.name;
    LocationIdService.locationToCompany[locationId] = summary.companyId;
  }
}
