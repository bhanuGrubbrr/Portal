import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
//import { LocationTenderSettingModel } from '../core/models/card-network.model'
import { BlobReference } from '../core/models/blobreference';
import { PosOrderType } from '../core/models/order-type-option.model';
import { PosProxyOnboardModel } from '../core/models/pos-proxy-agent-onboard.model';
import { PosSyncSchedule } from '../core/models/possyncschedule';
import { LoggingService } from './logging.service';
import { MenuService, SyncStatus } from './menu.service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class LocationPosService {
  constructor(
    private httpClient: HttpClient,
    private loggingService: LoggingService,
    private menuService: MenuService
  ) {}

  downloadAgentLog(
    locationId: string,
    agentName: string,
    logName: string
  ): Observable<Blob> {
    var request = this.httpClient.get<Blob>(
      `${API_URL}/location/${locationId}/pos/agentlogs/${agentName}/export/${logName}`,
      { responseType: 'blob' as 'json' }
    );
    return request;
  }

  getAgentLogs(
    locationId: string,
    agentName: string
  ): Observable<BlobReference[]> {
    return this.httpClient.get<BlobReference[]>(
      `${API_URL}/location/${locationId}/pos/agentlogs/${agentName}`
    );
  }

  getPosOrderTypes(locationId: string): Observable<PosOrderType[]> {
    return this.httpClient.get<PosOrderType[]>(
      `${API_URL}/location/${locationId}/pos/order-types`
    );
  }

  syncPosMenu(locationId: string): Observable<boolean> {
    this.menuService.resetMenuCacheForLocation(locationId);
    return this.httpClient.get<boolean>(
      `${API_URL}/location/${locationId}/pos/sync`
    );
  }

  pollingSyncMenu(locationId: string): Observable<SyncStatus> {
    return this.httpClient.get<SyncStatus>(
      `${API_URL}/location/${locationId}/pos/syncstatus`
    );
  }

  getPosSyncSchedule(locationId: string): Observable<PosSyncSchedule> {
    return this.httpClient.get<PosSyncSchedule>(
      `${API_URL}/location/${locationId}/pos/menuSyncSchedule`
    );
  }

  updatePosSyncSchedule(
    locationId: string,
    posSyncSchedule: PosSyncSchedule
  ): Observable<PosSyncSchedule> {
    return this.httpClient.post<PosSyncSchedule>(
      `${API_URL}/location/${locationId}/pos/menuSyncSchedule`,
      posSyncSchedule
    );
  }

  getPosProxyOnboardCode(locationId: string): Observable<PosProxyOnboardModel> {
    return this.httpClient.get<PosProxyOnboardModel>(
      `${API_URL}/location/${locationId}/pos/proxycode`
    );
  }
}
