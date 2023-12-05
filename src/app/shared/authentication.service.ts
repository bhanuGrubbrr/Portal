import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Subscription } from 'rxjs';
import { authCodeFlowConfig } from 'src/app/auth.config';
import { StorageService } from '../grubbrr/service/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnInit, OnDestroy {
  public loginFailed: boolean = false;
  public userProfile: object;
  public usePopup: boolean;
  public login: false;
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private route: ActivatedRoute,
    private oauthService: OAuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  get hasValidAccessToken() {
    return this.oauthService.hasValidAccessToken();
  }

  get hasValidIdToken() {
    return this.oauthService.hasValidIdToken();
  }

  // eslint-disable-next-line @angular-eslint/contextual-lifecycle
  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.login = p['login'];
    });
  }

  async loginCode() {
    // Tweak config for code flow
    this.oauthService.configure(authCodeFlowConfig);
    await this.oauthService.loadDiscoveryDocument();
    sessionStorage.setItem('flow', 'code');

    this.oauthService.initLoginFlow('/some-state;p1=1;p2=2?p3=3&p4=4');
    // the parameter here is optional. It's passed around and can be used after logging in
  }

  logout() {
    this.oauthService.logOut();
    this.oauthService.revokeTokenAndLogout();
  }

  loadUserProfile(): void {
    this.oauthService.loadUserProfile().then((up) => (this.userProfile = up));
  }

  startAutomaticRefresh(): void {
    this.oauthService.setupAutomaticSilentRefresh();
  }

  stopAutomaticRefresh(): void {
    this.oauthService.stopAutomaticRefresh();
  }

  get avatar() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return (claims as { [key: string]: any })['picture'] as string;
  }

  get email() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return (claims as { [key: string]: any })['email'] as string;
  }

  get nickname() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return (claims as { [key: string]: any })['nickname'] as string;
  }

  get sub() {
    var claims = this.oauthService.getIdentityClaims();
    if (!claims) return null;
    return (claims as { [key: string]: any })['sub'] as string;
  }

  refresh() {
    this.oauthService.oidc = true;

    if (
      !this.oauthService.useSilentRefresh &&
      this.oauthService.responseType === 'code'
    ) {
      this.oauthService
        .refreshToken()
        .then((info) => console.debug('refresh ok', info))
        .catch((err) => console.error('refresh error', err));
    } else {
      this.oauthService
        .silentRefresh()
        .then((info) => console.debug('silent refresh ok', info))
        .catch((err) => console.error('silent refresh error', err));
    }
  }

  set requestAccessToken(value: boolean) {
    this.oauthService.requestAccessToken = value;
    localStorage.setItem('requestAccessToken', '' + value);
  }

  set useHashLocationStrategy(value: boolean) {
    const oldValue = localStorage.getItem('useHashLocationStrategy') === 'true';
    if (value !== oldValue) {
      localStorage.setItem('useHashLocationStrategy', value ? 'true' : 'false');
      window.location.reload();
    }
  }

  get useHashLocationStrategy() {
    return localStorage.getItem('useHashLocationStrategy') === 'true';
  }

  get id_token() {
    return this.oauthService.getIdToken();
  }

  get access_token() {
    return this.oauthService.getAccessToken();
  }

  get id_token_expiration() {
    return this.oauthService.getIdTokenExpiration();
  }

  get access_token_expiration() {
    return this.oauthService.getAccessTokenExpiration();
  }
}
