import { Injectable } from '@angular/core';
import { Features, Roles } from 'src/app/core/global-constants';
import { UserDetailsModel } from '../core/models/userdetails.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  checkPermission(
    user: UserDetailsModel,
    feature: Features,
    permission: Roles
  ): boolean {
    if (!feature) feature = Features.All;

    const featurePermission = user.featureRoles.find(
      (f) => f.feature === feature
    );

    if (!!featurePermission) {
      switch (permission) {
        case Roles.User:
          return featurePermission.permission !== Roles.None;
        case Roles.Admin:
          return featurePermission.permission === Roles.Admin;
      }
    }
    return false;
  }
}
