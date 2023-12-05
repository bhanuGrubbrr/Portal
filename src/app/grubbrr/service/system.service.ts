import { Injectable } from '@angular/core';
import { SystemServiceClient } from '../generated/systemService_pb.client';
import {
  LocaleOptionsVM,
  PaymentSettingsVM,
  PosSettingsVM,
  PosSyncIntegrationDefinitionVM,
  PosSyncMetaRecordVM,
  PosSyncTypeVM,
} from '../generated/system_pb';
import { grpcTransport } from './grpc/transport';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  private async get_system_client() {
    return new SystemServiceClient(grpcTransport());
  }

  public async getCurrencyOptions() {
    const client = await this.get_system_client();
    const result = await client.getCurrencyOptions({});
    return result.response;
  }
  public async getLocaleOptions(): Promise<LocaleOptionsVM> {
    const client = await this.get_system_client();
    const result = await client.getLocaleOptions({});
    return result.response;
  }
  public async getPosSettings(): Promise<PosSettingsVM> {
    const client = await this.get_system_client();
    const result = await client.getPosSettings({});
    return result.response;
  }
  public async getPaymentSettings(): Promise<PaymentSettingsVM> {
    const client = await this.get_system_client();
    const result = await client.getPaymentSettings({});
    return result.response;
  }

  async getPosSyncMetaRecordAsync(): Promise<PosSyncMetaRecordVM> {
    const client = await this.get_system_client();
    const result = await client.getPosSyncMetaRecordAsync({});
    return result.response;
  }

  async getPosSyncDefinition(): Promise<PosSyncIntegrationDefinitionVM> {
    const client = await this.get_system_client();
    const result = await client.getPosSyncDefinition({});
    return result.response;
  }

  async addPosSyncType(
    pid: string,
    posSyncIntegrationDefinition: PosSyncIntegrationDefinitionVM
  ): Promise<PosSyncTypeVM> {
    const client = this.get_system_client();
    const result = await (
      await client
    ).addPosSyncType({ pid, posSyncIntegrationDefinition });
    return result.response;
  }
}
