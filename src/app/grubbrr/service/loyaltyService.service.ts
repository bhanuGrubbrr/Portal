import { Injectable } from '@angular/core';
import { LoyaltyServiceClient } from '../generated/loyaltyService_pb.client';
import {
  DiscountTendersVM,
  LoyaltyIntegrationConfigVM,
  LoyaltyIntegrationDefinitionsVM,
  LoyaltyIntegrationDefinitionVM,
} from '../generated/loyalty_pb';
import { grpcTransport } from './grpc/transport';

@Injectable({
  providedIn: 'root',
})
export class LoyaltyService2 {
  public async get_client() {
    return new LoyaltyServiceClient(grpcTransport());
  }

  public async getIntegrations(): Promise<LoyaltyIntegrationDefinitionsVM> {
    const client = await this.get_client();
    const result = await client.getIntegrationDefinitions({});
    return result.response;
  }

  public async getLocationConfig(
    locationId: string
  ): Promise<LoyaltyIntegrationConfigVM> {
    const client = await this.get_client();
    const result = await client.getLocationConfig({ locationId });
    return result.response;
  }

  public async getDiscountTenders(
    locationId: string
  ): Promise<DiscountTendersVM> {
    const client = await this.get_client();
    const result = await client.getDiscountTenders({ locationId });
    return result.response;
  }

  public async updateLocationConfig(
    locationId: string,
    configuration: LoyaltyIntegrationConfigVM,
    integrationType: string
  ): Promise<LoyaltyIntegrationConfigVM> {
    const client = await this.get_client();
    const result = await client.updateLocationConfig({
      locationId,
      configuration,
      integrationType,
    });
    return result.response;
  }

  public async upsertIntegrationDefinition(
    definition: LoyaltyIntegrationDefinitionVM
  ): Promise<LoyaltyIntegrationDefinitionVM> {
    const client = await this.get_client();
    const result = await client.upsertIntegrationDefinition(definition);
    return result.response;
  }

  public async removeIntegrationDefinition(
    integrationId: string
  ): Promise<void> {
    const client = await this.get_client();
    await client.removeIntegrationDefinition({ integrationId });
  }
}
