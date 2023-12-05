import { Injectable } from '@angular/core';
import { UpsellServiceClient } from '../generated/upsellService_pb.client';
import { grpcTransport } from './grpc/transport';
import { EmptyResponse } from '../generated/common_pb';
import {
  ItemUpsellGroupListVM,
  ItemUpsellMappingsVM,
  OrderUpsellGroupListVM,
} from '../generated/upsell_pb';

@Injectable({
  providedIn: 'root',
})
export class UpsellService {
  constructor() {}

  async get_client() {
    return new UpsellServiceClient(grpcTransport());
  }

  async getOrderUpsellGroups(
    locationId: string
  ): Promise<OrderUpsellGroupListVM> {
    const client = await this.get_client();
    const result = await client.getOrderUpsellGroups({ locationId });
    return result.response;
  }
  async upsertOrderUpsellGroups(
    locationId: string,
    groups: OrderUpsellGroupListVM
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.upsertOrderUpsellGroups({ locationId, groups });
    return result.response;
  }

  async getItemUpsellGroups(
    locationId: string
  ): Promise<ItemUpsellGroupListVM> {
    const client = await this.get_client();
    const result = await client.getItemUpsellGroups({ locationId });
    return result.response;
  }
  async upsertItemUpsellGroups(
    locationId: string,
    groups: ItemUpsellGroupListVM
  ): Promise<EmptyResponse> {
    const client = await this.get_client();
    const result = await client.upsertItemUpsellGroups({ locationId, groups });
    return result.response;
  }
  async getItemUpsellMappings(
    locationId: string
  ): Promise<ItemUpsellMappingsVM> {
    const client = await this.get_client();
    const result = await client.getItemUpsellMappings({ locationId });
    return result.response;
  }
  async upsertItemUpsellMappings(
    locationId: string,
    mapping: ItemUpsellMappingsVM
  ): Promise<ItemUpsellMappingsVM> {
    const client = await this.get_client();
    const result = await client.upsertItemUpsellMappings({
      locationId,
      mapping,
    });
    return result.response;
  }
}
