import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { LoyaltyProviderModel } from '../core/models/loyaltyprovider.model';
import { LoyaltySettingModel } from '../core/models/loyaltysetting.model';
import { TenderMappingModel } from '../core/models/TenderMappingModel';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class LoyaltyService {
  constructor(private httpClient: HttpClient) {}

  getAllLoyaltyProviders(): Observable<LoyaltyProviderModel[]> {
    return this.httpClient.get<LoyaltyProviderModel[]>(
      `${API_URL}/system/loyalty`
    );
  }

  getCompanySettings(companyId: string): Observable<LoyaltySettingModel> {
    return this.httpClient.get<LoyaltySettingModel>(
      `${API_URL}/company/${companyId}/loyalty`
    );
  }

  updateCompanySettings(
    companyId: string,
    loyaltySetting: LoyaltySettingModel
  ): Observable<LoyaltySettingModel> {
    return this.httpClient.post<LoyaltySettingModel>(
      `${API_URL}/company/${companyId}/loyalty`,
      loyaltySetting
    );
  }

  getLocationSettings(locationId: string): Observable<LoyaltySettingModel> {
    return this.httpClient.get<LoyaltySettingModel>(
      `${API_URL}/location/${locationId}/loyalty`
    );
  }

  getTenderSettings(locationId: string): Observable<TenderMappingModel> {
    return this.httpClient.get<TenderMappingModel>(
      `${API_URL}/location/${locationId}/loyalty/tenders`
    );
  }

  updateLocationSettings(
    locationId: string,
    loyaltySetting: LoyaltySettingModel
  ): Observable<LoyaltySettingModel> {
    return this.httpClient.post<LoyaltySettingModel>(
      `${API_URL}/location/${locationId}/loyalty`,
      loyaltySetting
    );
  }
}
