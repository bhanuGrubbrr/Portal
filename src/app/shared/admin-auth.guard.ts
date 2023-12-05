import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/grubbrr/service/user.service';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private oauthService: OAuthService,
    private userService: UserService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (
      !this.oauthService.hasValidAccessToken() &&
      !this.oauthService.hasValidIdToken()
    )
      return false;

    return new Promise((res) => {
      this.userService.getUserMe().then((user) => {
        if (user.isAdmin) {
          res(true);
        } else {
          this.router.navigateByUrl('/error/403');
          res(false);
        }
      });
    });
  }
}
