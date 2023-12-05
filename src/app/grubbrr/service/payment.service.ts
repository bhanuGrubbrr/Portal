import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CardNetworkModel,
  TenderMapping,
} from '../core/models/card-network.model';
import { PaymentIntegrationDefinitionModel } from '../core/models/payment/paymentintegrationdefinition.model';
//import { TenderMappingModel } from '../core/models/TenderMappingModel';
import { LoggingService } from './logging.service';

import { PaymentServiceClient } from 'src/app/grubbrr/generated/paymentService_pb.client';
import { grpcTransport } from './grpc/transport';
import {
  KioskPaymentConfigVM,
  PaymentIntegrationConfigVM,
  PaymentIntegrationsVM,
  PaymentTendersVM,
} from '../generated/payment_pb';
import _ from 'lodash';
import { FormValues } from '../generated/common_pb';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private httpClient: HttpClient,
    private loggingService: LoggingService
  ) {}

  private get_grpc_client() {
    return new PaymentServiceClient(grpcTransport());
  }

  public async getLocationPaymentTenders(
    locationId: string,
    paymentIntegrationId: string
  ): Promise<PaymentTendersVM> {
    const client = this.get_grpc_client();
    const result = await client.getLocationPaymentTenders({
      locationId: locationId,
      paymentIntegrationId: paymentIntegrationId,
    });
    return result.response;
  }

  public async getLocationPaymentIntegrations(
    locationId: string
  ): Promise<PaymentIntegrationsVM> {
    const client = this.get_grpc_client();
    const result = await client.getLocationPaymentIntegrations({
      locationId: locationId,
    });
    return result.response;
  }

  public async updateLocationPaymentIntegrationConfig(
    locationId: string,
    config: PaymentIntegrationConfigVM
  ) {
    const client = this.get_grpc_client();
    const result = await client.updateLocationPaymentIntegrationConfig({
      locationId: locationId,
      config: config,
      defaultPaymentTender: '',
    });
    return result.response;
  }

  public async updateLocationPaymentDefaultTender(
    locationId: string,
    defaultPaymentTender: string,
    enableAmazonOnePay: boolean
  ) {
    const client = this.get_grpc_client();
    const result = await client.updateLocationPaymentIntegrationConfig({
      locationId: locationId,
      config: undefined,
      defaultPaymentTender,
      enableAmazonOnePay,
    });
    return result.response;
  }

  public async deletePaymentProviderSetting(
    locationId: string,
    paymentIntegrationId: string
  ): Promise<PaymentIntegrationConfigVM[]> {
    const client = this.get_grpc_client();
    const result = await client.removeLocationPaymentIntegration({
      locationId,
      paymentIntegrationId,
    });
    return result.response.list;
  }

  public async getKioskPaymentIntegrations(
    locationId: string,
    kioskId: string
  ): Promise<PaymentIntegrationsVM> {
    const client = this.get_grpc_client();
    const result = await client.getKioskPaymentIntegrations({
      locationId: locationId,
      kioskId: kioskId,
    });
    return result.response;
  }

  public async updateKioskPaymentIntegrations(
    locationId: string,
    kioskId: string,
    paymentConfig: KioskPaymentConfigVM
  ): Promise<void> {
    const client = this.get_grpc_client();
    const result = await client.updateKioskPaymentIntegrations({
      locationId: locationId,
      kioskId: kioskId,
      config: paymentConfig,
    });
    //return result.response;
  }

  refundOrder(locationId: string, invoiceNo: string): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${API_URL}/location/${locationId}/orders/${invoiceNo}/refund`,
      {}
    );
  }

  partialRefundOrderByAmount(
    locationId: string,
    invoiceNo: string,
    refundAmount: number
  ): Observable<boolean> {
    let headers = { 'Content-Type': 'application/json' };

    return this.httpClient.post<boolean>(
      `${API_URL}/location/${locationId}/orders/${invoiceNo}/refund/byamount`,
      `'${refundAmount}'`,
      { headers }
    );
  }

  partialRefundOrderByItems(
    locationId: string,
    invoiceNo: string,
    itemIds: Array<string>
  ): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${API_URL}/location/${locationId}/orders/${invoiceNo}/refund/byitem`,
      itemIds
    );
  }

  getAllPaymentProviders(): Observable<PaymentIntegrationDefinitionModel[]> {
    return this.httpClient.get<PaymentIntegrationDefinitionModel[]>(
      `${API_URL}/system/payment/provider`
    );
  }

  // getCardNetworks(): Observable<CardNetworkModel[]> {
  //   return this.httpClient.get<CardNetworkModel[]>(
  //     `${API_URL}/system/payment/creditcardnetworks`
  //   );
  // }

  // getPaymentIntegrationDefinition(
  //   paymentIntegrationId: string
  // ): Observable<PaymentIntegrationDefinitionModel> {
  //   return this.httpClient.get<PaymentIntegrationDefinitionModel>(
  //     `${API_URL}/system/payment/provider/${paymentIntegrationId}`
  //   );
  // }

  // getAllLocationTenders(
  //   locationId: string,
  // ): Observable<TenderDefinitionsModel> {
  //   return this.httpClient.get<TenderDefinitionsModel>(
  //     `${API_URL}/location/${locationId}/pos/tenders`
  //   );
  // }

  // getLocationTenderDefinitions(
  //   locationId: string,
  //   category: string
  // ): Observable<TenderDefinitionsModel> {
  //   return this.httpClient.get<TenderDefinitionsModel>(
  //     `${API_URL}/location/${locationId}/pos/tenders/options/${category}`
  //   );
  // }

  // getLocationTenderMappings(
  //   locationId: string
  // ): Observable<LocationTenderSettingModel> {
  //   return this.httpClient.get<LocationTenderSettingModel>(
  //     `${API_URL}/location/${locationId}/pos/setting/tender`
  //   );
  // }

  // getLocationTenderOptions(
  //   locationId: string
  // ): Observable<LocationTenderSettingModel> {
  //   return this.httpClient.get<LocationTenderSettingModel>(
  //     `${API_URL}/location/${locationId}/tenders/options`
  //   );
  // }

  //
  //  Tenders related APIs
  //
  // getLocationLoyaltyTenderOptions(
  //   locationId: string
  // ): Observable<TenderMapping> {
  //   return this.httpClient.get<TenderMapping>(
  //     `${API_URL}/location/${locationId}/tenders/options/loyalty`
  //   );
  // }

  // getLocationPaymentTenderMapping(
  //   locationId: string,
  //   paymentIntegrationId: string
  // ): Observable<TenderMapping> {
  //   return this.httpClient.get<TenderMapping>(
  //     `${API_URL}/location/${locationId}/tenders/options/payment/${paymentIntegrationId}`
  //   );
  // }

  // getLocationGratuityTenderOptions(
  //   locationId: string
  // ): Observable<TenderMapping> {
  //   return this.httpClient.get<TenderMapping>(
  //     `${API_URL}/location/${locationId}/tenders/options/gratuity`
  //   );
  // }
  // ------- Tenders ------------

  //
  // Payment Integration Config
  //

  // getLocationPaymentIntegrations(
  //   locationId: string
  // ): Observable<PaymentIntegrationDefinitionModel[]> {
  //   return this.httpClient.get<PaymentIntegrationDefinitionModel[]>(
  //     `${API_URL}/location/${locationId}/payment/providers/enabled`
  //   );
  // }

  // getPaymentIntegration(
  //   locationId: string,
  //   paymentIntegrationId: string
  // ): Observable<PaymentIntegrationDefinitionModel> {
  //   return this.httpClient.get<PaymentIntegrationDefinitionModel>(
  //     `${API_URL}/${locationId}/payment/${paymentIntegrationId}`
  //   );
  // }

  // updatePaymentProviderSetting(
  //   locationId: string,
  //   paymentProviderSetting: PaymentProviderSettingModel
  // ): Observable<PaymentProviderSettingModel> {
  //   return this.httpClient.post<PaymentProviderSettingModel>(
  //     `${API_URL}/location/${locationId}/payment/${ paymentIntegrationId}`,
  //     paymentProviderSetting
  //   );
  // }

  // getPaymentProviderSettings(
  //   locationId: string,
  //   paymentIntegrationId: string
  // ): Observable<PaymentProviderSettingModel[]> {
  //   return this.httpClient.get<PaymentProviderSettingModel[]>(
  //     `${API_URL}/location/${locationId}/payment/${paymentIntegrationId}`
  //   );
  // }

  // ------ Payment Integration Config ------------
}
