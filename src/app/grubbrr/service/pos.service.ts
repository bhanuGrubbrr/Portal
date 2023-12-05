import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { defaultOrderTypes } from '../core/models/defaults';
import { OrderType } from '../core/models/order-type-option.model';
import { PosTypeModel } from '../core/models/postype.model';
import { LoggingService } from './logging.service';
import { PosSyncTypeModel } from '../core/models/posSynctype.model';

const API_URL = `${environment.apiUrl}`;
@Injectable({
  providedIn: 'root',
})
export class PosService {
  constructor(
    private httpClient: HttpClient,
    private loggingService: LoggingService
  ) {}

  getDefaultOrderTypes(): Observable<OrderType[]> {
    return of(defaultOrderTypes);
  }

  getAllPos(): Observable<PosTypeModel[]> {
    return this.httpClient.get<PosTypeModel[]>(`${API_URL}/system/pos`);
  }

  getPosByTypeId(posTypeId: string): Observable<PosTypeModel> {
    return this.httpClient.get<PosTypeModel>(
      `${API_URL}/system/pos/${posTypeId}`
    );
  }

  //we use any as we are pulling from the type PosIntegrationDefinition, and as it changes, so should the json obj
  getPosIntegrationDefinitions(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API_URL}/system/pos/definitions`);
  }

  posSyncDefinations(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${API_URL}/system/posSync`);
  }

  getPosIntegrationDefinition(): Promise<object> {
    return firstValueFrom(
      this.httpClient.get<object>(`${API_URL}/system/pos/definition`)
    );
  }

  upsertPosIntegrationDefinition(posType: string): Promise<PosTypeModel> {
    return firstValueFrom(
      this.httpClient.post<PosTypeModel>(`${API_URL}/system/pos`, posType)
    );
  }

  upsertPosSyncIntegrationDefinition(
    posSyncType: string
  ): Promise<PosSyncTypeModel> {
    return firstValueFrom(
      this.httpClient.post<PosSyncTypeModel>(
        `${API_URL}/system/posSync`,
        posSyncType
      )
    );
  }

  removePosIntegrationDefinition(posType: any) {
    return this.httpClient.delete(`${API_URL}/system/pos/${posType.id}`);
  }

  getPosSyncIntegrationDefinition(): Promise<object> {
    return firstValueFrom(
      this.httpClient.get<object>(`${API_URL}/system/posSync/definition`)
    );
  }
}
