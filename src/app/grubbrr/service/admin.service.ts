import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AdminDeactivateUserModel,
  AdminUserModel,
} from '../core/models/adminuser.model';
import { LoggingService } from './logging.service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private httpClient: HttpClient,
    private loggingService: LoggingService
  ) {}

  getUsers(): Observable<AdminUserModel[]> {
    return this.httpClient.get<AdminUserModel[]>(`${API_URL}/admin/users`);
  }

  addUser(user: AdminUserModel): Observable<AdminUserModel> {
    return this.httpClient.post<AdminUserModel>(`${API_URL}/admin/user`, user);
  }

  removeUser(user: AdminDeactivateUserModel): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `${API_URL}/admin/user/deactivate`,
      user
    );
  }
}
