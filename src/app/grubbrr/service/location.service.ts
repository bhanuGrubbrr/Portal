import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LocationModel } from '../core/models/location/location.model';
import { OrderSummaryModel } from '../core/models/orderdetails.model';
import { OrderRecordsModel } from '../core/models/orderrecords.model';
import { PrinterSettingsModel } from '../core/models/printersettings.model';
import { screenSaver } from '../core/models/screensaver.model';
import { LoggingService } from './logging.service';
import { LocationsServiceClient } from '../generated/locationsService_pb.client';
import { grpcTransport } from './grpc/transport';
import {
  LocationBaseVM,
  LocationDetailVM,
  LocationSetupStatusVM,
  LocationStaffVM,
  LocationsVM,
  PosIntegrationConfigVM,
  PosIntegrationVM,
  PosSyncIntegrationConfigVM,
  StaffVM,
  TransformConfigVM,
} from '../generated/locations_pb';
import { Nothing } from '../generated/requests_pb';
import {
  AccessControlListVM,
  RoleAssignmentVM,
} from '../generated/accessList_pb';
import { TableBody } from 'primeng/table';
import { toNumber } from 'lodash';
import { EmptyResponse } from '../generated/common_pb';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(
    private httpClient: HttpClient,
    private loggingService: LoggingService
  ) {}

  private get_client() {
    return new LocationsServiceClient(grpcTransport());
  }

  // getTenderMappings(locationId: string): Observable<TenderMappingModel> {
  //   return this.httpClient.get<TenderMappingModel>(
  //     `${API_URL}/location/${locationId}/payment/settings/tenders`
  //   );
  // }

  // getAllLocations(companyId: string): Observable<LocationModel[]> {
  //   return this.httpClient.get<LocationModel[]>(
  //     `${API_URL}/company/${companyId}/location`
  //   );
  // }
  async checkIfNCR(locationID: string) {
    const posSettings = await this.getLocationPosSettings(locationID);
    if (posSettings?.config) {
      const posIntegrationId = posSettings?.config?.posIntegrationId;
      if (
        posIntegrationId === 'pid-ncr-aloha' ||
        posIntegrationId === 'pid-ncr-v2-aloha' ||
        posIntegrationId === 'pid-ncr-aloha-cloud'
      ) {
        return true;
      }
    }
    return false;
  }

  getParentLocations(companyId: string): Observable<LocationModel[]> {
    return this.httpClient.get<LocationModel[]>(
      `${API_URL}/company/${companyId}/location/parents`
    );
  }

  async getLocations(companyId: string): Promise<LocationsVM> {
    const client = this.get_client();
    const result = await client.getLocations({ companyId });
    return result.response;
  }

  async getLocationDetails(locationId: string): Promise<LocationDetailVM> {
    const client = this.get_client();
    const result = await client.getLocationDetails({ locationId });
    return result.response;
  }

  async getLocationSummary(locationId: string): Promise<LocationBaseVM> {
    const client = this.get_client();
    const result = await client.getLocationSummary({ locationId });
    return result.response;
  }

  async getLocationSetupStatus(
    locationId: string
  ): Promise<LocationSetupStatusVM> {
    const client = this.get_client();
    const result = await client.getLocationSetupStatus({ locationId });
    return result.response;
  }

  async addStaff(locationId: string, staff: StaffVM): Promise<LocationStaffVM> {
    const client = await this.get_client();
    const result = await client.addStaff({ locationId, staff });
    return result.response;
  }

  async removeStaff(locationId: string, id: string): Promise<LocationStaffVM> {
    const client = await this.get_client();
    const result = await client.removeStaff({ locationId, id });
    return result.response;
  }

  async getStaff(locationId: string): Promise<LocationStaffVM> {
    const client = await this.get_client();
    const result = await client.getStaff({ locationId });
    return result.response;
  }

  async updateLocation(
    locationId: string,
    location: LocationDetailVM
  ): Promise<LocationDetailVM> {
    const client = this.get_client();
    const result = await client.updateLocation({ locationId, location });
    return result.response;
  }
  async removeLocation(locationId: string): Promise<Nothing> {
    const client = this.get_client();
    const result = await client.removeLocation({ locationId });
    return result.response;
  }

  async addLocation(
    companyId: string,
    location: LocationDetailVM
  ): Promise<LocationDetailVM> {
    const client = this.get_client();
    const result = await client.addLocation({ companyId, location });
    return result.response;
  }

  async getLocationPosSettings(locationId: string): Promise<PosIntegrationVM> {
    const client = this.get_client();
    const result = await client.getLocationPosSettings({ locationId });
    return result.response;
  }

  async updateLocationPos(
    locationId: string,
    config: PosIntegrationConfigVM
  ): Promise<PosIntegrationConfigVM> {
    const client = this.get_client();
    const result = await client.updateLocationPos({ locationId, config });
    return result.response;
  }

  async updatePosSyncSetting(
    locationId: string,
    posSyncIntegrationConfig: PosSyncIntegrationConfigVM
  ): Promise<PosSyncIntegrationConfigVM> {
    const client = this.get_client();
    const result = await client.updatePosSyncSetting({
      locationId,
      posSyncIntegrationConfig,
    });
    return result.response;
  }

  async proxyRemoteSync(locationId: string): Promise<EmptyResponse> {
    const client = this.get_client();
    const result = await client.proxyRemoteSync({ locationId });
    return result.response;
  }

  async pullLatestPosMenu(locationId: string): Promise<EmptyResponse> {
    const client = this.get_client();
    const result = await client.pullLatestPosServiceSnapshot({ locationId });
    return result.response;
  }

  async getLocationsUsers(locationId: string): Promise<AccessControlListVM> {
    const client = this.get_client();
    const result = await client.getLocationUserAccessList({ locationId });
    return result.response;
  }

  // Menu/Order Transformations
  async getTransformConfig(locationId: string): Promise<TransformConfigVM> {
    const client = this.get_client();
    const result = await client.getTransformConfig({ locationId });
    return result.response;
  }

  async saveTransformConfig(
    locationId: string,
    config: TransformConfigVM
  ): Promise<void> {
    const client = this.get_client();
    await client.addTransformConfig({ locationId, config });
  }

  // GEM
  async fetchGemAccessToken(application: string, locationId: string) {
    const client = this.get_client();
    const response = await client.getGEMAccessToken({
      application,
      locationId,
    });

    return response.response.accessToken;
  }

  // Access
  async addUserToLocation(
    locationId: string,
    userEmail: string,
    roleName: string
  ): Promise<AccessControlListVM> {
    const client = this.get_client();
    const result = await client.addUserAccess({
      locationId,
      userEmail,
      roleName,
    });
    return result.response;
  }

  async updateLocationUserAccess(
    locationId: string,
    userId: string,
    roleName: string
  ): Promise<AccessControlListVM> {
    const client = this.get_client();
    const result = await client.updateUserAccess({
      locationId,
      userId,
      roleName,
    });
    return result.response;
  }

  async deleteLocationUserAccess(
    locationId: string,
    userId: string
  ): Promise<AccessControlListVM> {
    const client = this.get_client();
    const result = await client.removeUserAccess({ locationId, userId });
    return result.response;
  }

  updateScreenSaver(
    locationId: string,
    screenSaver: screenSaver,
    displayOrder: number
  ): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${API_URL}/location/${locationId}/kiosk/screensaver/${displayOrder}`,
      screenSaver
    );
  }

  getScreenSaver(
    locationId: string,
    displayOrder: number
  ): Observable<screenSaver> {
    return this.httpClient.get<screenSaver>(
      `${API_URL}/location/${locationId}/kiosk/screensaver/${displayOrder}`
    );
  }

  deleteScreenSaver(
    locationId: string,
    index: number,
    displayOrder: number
  ): Observable<boolean> {
    return this.httpClient.delete<boolean>(
      `${API_URL}/location/${locationId}/kiosk/screensaver/${index}/${displayOrder}`
    );
  }

  getPrinterSettings(locationId: string): Observable<PrinterSettingsModel[]> {
    return this.httpClient.get<PrinterSettingsModel[]>(
      `${API_URL}/location/${locationId}/printer`
    );
  }

  deletePrinterSettings(locationId: string, id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(
      `${API_URL}/location/${locationId}/printer/${id}`
    );
  }

  getLocationPrinterSetting(
    locationId: string,
    id: string
  ): Observable<PrinterSettingsModel> {
    return this.httpClient.get<PrinterSettingsModel>(
      `${API_URL}/location/${locationId}/printer/${id}`
    );
  }

  upsertPrinterSettings(
    locationId: string,
    id: string | undefined,
    body: PrinterSettingsModel
  ): Observable<PrinterSettingsModel> {
    if (id) {
      return this.httpClient.put<PrinterSettingsModel>(
        `${API_URL}/location/${locationId}/printer/${id}`,
        body
      );
    } else {
      return this.httpClient.post<PrinterSettingsModel>(
        `${API_URL}/location/${locationId}/printer`,
        body
      );
    }
  }

  // Orders Service
  getOrderHistory(
    locationId: string,
    startTime?: string,
    endTime?: string,
    count?: number | string,
    continuation?: string
  ): Observable<OrderRecordsModel> {
    var param = this.constructOrderFilterParams(
      startTime,
      endTime,
      count,
      continuation
    );

    return this.httpClient.get<OrderRecordsModel>(
      `${API_URL}/location/${locationId}/orders/history`,
      { params: param }
    );
  }

  orderSummary(
    locationId: string,
    startTime?: string,
    endTime?: string
  ): Observable<OrderSummaryModel> {
    var param = this.constructOrderFilterParams(
      startTime,
      endTime,
      undefined,
      undefined
    );

    var request = this.httpClient.get<OrderSummaryModel>(
      `${API_URL}/location/${locationId}/orders/summary`,
      { params: param }
    );
    return request;
  }

  exportTable(
    locationId: string,
    startTime?: string,
    endTime?: string
  ): Observable<Blob> {
    var param = this.constructOrderFilterParams(
      startTime,
      endTime,
      undefined,
      undefined
    );

    var request = this.httpClient.get<Blob>(
      `${API_URL}/location/${locationId}/orders/export`,
      { responseType: 'blob' as 'json', params: param }
    );
    return request;
  }

  private constructOrderFilterParams(
    startTime: string | undefined,
    endTime: string | undefined,
    count: string | number | undefined,
    continuation: string | undefined
  ) {
    var param: ParamObj = {};

    if (startTime !== undefined) {
      param['AfterTime'] = startTime;
    }

    if (endTime !== undefined) {
      param['BeforeTime'] = endTime;
    }

    if (count !== undefined) {
      param['count'] = count;
    }

    if (continuation !== undefined) {
      param['continuation'] = continuation;
    }

    return param;
  }
}
interface ParamObj {
  [key: string]: any;
}
