import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { access } from 'fs';
import { firstValueFrom, Observable } from 'rxjs';
import { FeatureRoles, Features, Roles } from 'src/app/core/global-constants';
import { environment } from 'src/environments/environment';
import { UserDetailsModel } from '../core/models/userdetails.model';
import { RbacAccess } from './user-principal.service';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: UserDetailsModel;
  private userMePromise: Promise<any>;

  constructor(private httpClient: HttpClient) {}

  public async getUserMe(): Promise<UserDetailsModel> {
    if (!this.user) {
      if (!this.userMePromise) {
        this.userMePromise = firstValueFrom(
          this.httpClient.get(`${API_URL}/user/me`)
        );
      }

      //get response data and create new model INSTANCE
      const response = await this.userMePromise;
      this.user = new UserDetailsModel();
      Object.assign(this.user, response);

      this.assignUserRole(this.user);
    }

    return this.user;
  }

  private accessPromises = new Map<string, Promise<any>>();

  public getUserAccess(companyId: string): Promise<RbacAccess> | undefined {
    let accessPromise: Promise<RbacAccess> | undefined;
    if (!this.accessPromises.has(companyId)) {
      var p = firstValueFrom(
        this.httpClient.get<any>(`${API_URL}/user/access/${companyId}`)
      );
      accessPromise = p.then((v) => {
        var resp = new RbacAccess(v?.roleAssignments);
        return resp;
      });
      this.accessPromises.set(companyId, accessPromise);
    } else {
      accessPromise = this.accessPromises.get(companyId);
    }
    return accessPromise;
  }

  private assignUserRole(user: UserDetailsModel) {
    const fp: FeatureRoles = {
      feature: Features.All,
      permission: user.isAdmin ? Roles.Admin : Roles.User,
    };

    user.featureRoles.push(fp);
  }

  public resetPassword(redirectUrl: string): Observable<boolean> {
    let headers = { 'Content-Type': 'application/json' };

    return this.httpClient.post<boolean>(
      `${API_URL}/user/reset-password`,
      `'${redirectUrl}'`,
      { headers }
    );
  }
}
