import { Injectable } from '@angular/core';
import { OrderTypesResponse } from '../generated/kioskConfigService_pb';
import { KioskConfigServiceClient } from '../generated/kioskConfigService_pb.client';
import {
  BusinessHoursConfigurationVM,
  GratuityTendersVM,
  KioskConfigVM,
  LocalizationVM,
  OrderTokenSettingsVM,
  OrderTypeConfigVM,
  OrderTypeOptionVM,
  TimeoutSettingsVM,
  TipSettingsVM,
} from '../generated/kioskConfig_pb';
import { grpcTransport } from './grpc/transport';
import { EmptyResponse } from '../generated/common_pb';

@Injectable({
  providedIn: 'root',
})
export class KioskConfigService {
  public async get_client() {
    return new KioskConfigServiceClient(grpcTransport());
  }

  public async getOrderTypes(locationId: string): Promise<OrderTypesResponse> {
    const client = await this.get_client();
    const result = await client.getOrderTypes({ locationId });
    return result.response;
  }

  public async getCurrencyDivisor(
    locationId: string
  ): Promise<number | undefined> {
    const client = await this.get_client();
    const response = await client.getLocalization({ locationId });
    return response.response.currency?.divisor;
  }

  public async upsertOrderTypes(
    locationId: string,
    orderTypeOptions: OrderTypeOptionVM[]
  ): Promise<OrderTypesResponse> {
    const client = await this.get_client();
    const result = await client.upsertOrderTypes({
      locationId,
      orderTypeOptions,
    });
    return result.response;
  }

  public async getOrderToken(
    locationId: string
  ): Promise<OrderTokenSettingsVM> {
    const client = await this.get_client();
    const result = await client.getOrderToken({ locationId });
    return result.response;
  }

  public async upsertOrderToken(
    locationId: string,
    orderToken: OrderTokenSettingsVM
  ): Promise<OrderTokenSettingsVM> {
    const client = await this.get_client();
    const result = await client.upsertOrderToken({
      locationId,
      tokenSettings: orderToken,
    });
    return result.response;
  }

  public async getLocalization(locationId: string): Promise<LocalizationVM> {
    const client = await this.get_client();
    const result = await client.getLocalization({ locationId });
    return result.response;
  }

  public async getKioskConfig(locationId: string): Promise<KioskConfigVM> {
    const client = await this.get_client();
    const result = await client.getKioskConfig({
      locationId,
    });
    return result.response;
  }

  public async setLocalization(
    locationId: string,
    localization: LocalizationVM
  ): Promise<LocalizationVM> {
    const client = await this.get_client();
    const result = await client.upsertLocalization({
      locationId,
      localization,
    });
    return result.response;
  }

  public async getTimeoutSettings(
    locationId: string
  ): Promise<TimeoutSettingsVM> {
    const client = await this.get_client();
    const result = await client.getTimeoutSettings({ locationId });
    return result.response;
  }

  public async upsertTimeoutSettings(
    locationId: string,
    settings: TimeoutSettingsVM
  ): Promise<TimeoutSettingsVM> {
    const client = await this.get_client();
    const result = await client.upsertTimeoutSettings({ locationId, settings });
    return result.response;
  }

  public async getTipSettings(locationId: string): Promise<TipSettingsVM> {
    const client = await this.get_client();
    const result = await client.getTipSettings({ locationId });
    return result.response;
  }

  public async getGratuityTenders(
    locationId: string
  ): Promise<GratuityTendersVM> {
    const client = await this.get_client();
    const result = await client.getGratuityTenders({ locationId });
    return result.response;
  }

  public async upsertTipSettings(
    locationId: string,
    settings: TipSettingsVM
  ): Promise<TipSettingsVM> {
    const client = await this.get_client();
    const result = await client.upsertTipSettings({ locationId, settings });
    return result.response;
  }

  public async updateConceptFeatureFlag(
    locationId: string,
    isEnabled: boolean
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.updateConceptFeatureFlag({
      locationId,
      isEnabled,
    });
    return result.response;
  }

  public async updateShowCaloriesFeatureFlag(
    locationId: string,
    isEnabled: boolean
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.updateShowCaloriesFeatureFlag({
      locationId,
      isEnabled,
    });
    return result.response;
  }

  public async updateItemSpecialRequestFeatureFlag(
    locationId: string,
    isEnabled: boolean
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.updateItemSpecialRequestFeatureFlag({
      locationId,
      isEnabled,
    });
    return result.response;
  }

  public async updateCompanyLevelMenuManagementFlag(
    companyid: string,
    isEnabled: boolean
  ): Promise<EmptyResponse> {
    // As we dont have API now. For temporary reason adding data in localstorage
    // Once we get the API, we will replace
    localStorage.setItem('companyLevelMenuManagement', isEnabled.toString());
    return EmptyResponse;
  }

  public async getCompanyConfig(companyid: string): Promise<any> {
    // As we dont have API now. For temporary reason getting data in localstorage
    // Once we get the API, we will replace
    const config = {
      companyLevelMenuManagementEnabled: localStorage.getItem(
        'companyLevelMenuManagement'
      ),
    };
    return config;
  }

  public async getBusinessHoursConfiguration(
    locationId: string
  ): Promise<BusinessHoursConfigurationVM | null> {
    const client = await this.get_client();
    try {
      const result = await client.getBusinessHoursConfiguration({
        locationId,
      });
      return result.response;
    } catch {
      return null;
    }
  }

  public async upsertBusinessHoursConfiguration(
    locationId: string,
    configuration?: BusinessHoursConfigurationVM
  ): Promise<BusinessHoursConfigurationVM> {
    const client = await this.get_client();
    const result = await client.upsertBusinessHoursConfiguration({
      locationId,
      configuration,
    });
    return result.response;
  }
}
