import { Injectable } from '@angular/core';
import { OrderServiceClient } from '../generated/orderService_pb.client';
import {
  DiscountTendersVM,
  LoyaltyIntegrationConfigVM,
  LoyaltyIntegrationDefinitionsVM,
  LoyaltyIntegrationDefinitionVM,
} from '../generated/loyalty_pb';
import { grpcTransport } from './grpc/transport';
import { ReceiptResponse } from '../generated/order_pb';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  public async get_client() {
    return new OrderServiceClient(grpcTransport());
  }

  public async getReceiptImage(
    orderId: string,
    locationId: string
  ): Promise<ReceiptResponse> {
    const client = await this.get_client();
    const result = await client.getReceipt({ locationId, orderId });
    return result.response;
  }
}
