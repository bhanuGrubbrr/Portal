import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MenuSync, SyncRecord } from '../core/models/menusync.model';
import { LoggingService } from './logging.service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class MenuServiceService {
  constructor(
    private httpClient: HttpClient,
    private loggingService: LoggingService
  ) {}

  getMenuSyncHistory(
    locationId: string,
    count: number,
    token?: string | null,
    startDate?: string | null,
    endDate?: string | null
  ): Observable<MenuSync> {
    const tokenString = token ? `&token=${token}` : '';
    const startDateString = startDate ? `&startDate=${startDate}` : '';
    const endDateString = endDate ? `&endDate=${endDate}` : '';

    return this.httpClient.get<MenuSync>(
      `${API_URL}/location/${locationId}/pos/synchistory?count=${count}${tokenString}${startDateString}${endDateString}`
    );
  }
}
