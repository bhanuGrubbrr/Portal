import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { filter, map, mergeMap } from 'rxjs/operators';
import { authCodeFlowConfig } from './auth.config';
import { LocationIdService } from './grubbrr/service/location-id.service';
import { PaymentService } from './grubbrr/service/payment.service';
import { UtilService } from './grubbrr/service/utils.service';
import * as Sentry from '@sentry/angular-ivy';

import { TranslationService } from './metronic/modules/i18n';
import { locale as chLang } from './metronic/modules/i18n/vocabs/ch';
import { locale as deLang } from './metronic/modules/i18n/vocabs/de';
import { locale as enLang } from './metronic/modules/i18n/vocabs/en';
import { locale as esLang } from './metronic/modules/i18n/vocabs/es';
import { locale as frLang } from './metronic/modules/i18n/vocabs/fr';
import { locale as jpLang } from './metronic/modules/i18n/vocabs/jp';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // https://stackoverflow.com/questions/59640384/data-isnt-showing-angular8-metronic-theme
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private oauthService: OAuthService,
    private translationService: TranslationService,
    public loader: NgxUiLoaderService,
    private utilService: UtilService,
    private location: Location,
    private locationIdService: LocationIdService,
    private paymentService: PaymentService //    translate: TranslateService
  ) {
    // translate.setDefaultLang('en');
    // translate.use('en');
  }

  ngOnInit(): void {
    this.configureCodeFlow();
    this.configureLayout();

    this.configureCompanyAndLocationRouteListener();
    this.configureSentryUserTracking();
  }

  configureSentryUserTracking() {
    const claims: any = this.oauthService.getIdentityClaims();
    Sentry.setUser({
      email: claims?.email,
      id: claims?.sub,
    });
  }

  configureCompanyAndLocationRouteListener() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.params)
      )
      .subscribe(async (data) => {
        let grubbrrRouteParams = {
          locationId: '',
          companyId: '',
        };

        if (data.locationid) {
          grubbrrRouteParams.locationId = data.locationid;
        }
        if (data.companyid) {
          grubbrrRouteParams.companyId = data.companyid;
        }

        if (data.locationId) {
          grubbrrRouteParams.locationId = data.locationId;
        }
        if (data.companyId) {
          grubbrrRouteParams.companyId = data.companyId;
        }

        if (grubbrrRouteParams.locationId || grubbrrRouteParams.companyId) {
          if (
            grubbrrRouteParams.locationId &&
            grubbrrRouteParams.companyId === ''
          ) {
            grubbrrRouteParams.companyId =
              await this.locationIdService.GetCompanyIdFromLocationId(
                grubbrrRouteParams.locationId
              );
          }
          this.utilService.GrubbrrRouteEvent(grubbrrRouteParams);
        }
      });
  }

  private configureLayout() {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );
  }

  private configureCodeFlow() {
    this.oauthService.configure(authCodeFlowConfig);
    if (
      this.location.path().startsWith('/welcome') ||
      this.location.path() === '/noaccess'
    ) {
      return;
    }
    if (this.location.path().startsWith('/auth-callback')) {
      this.oauthService.loadDiscoveryDocumentAndLogin();
    } else {
      const LoginOptions = { state: this.location.path() };
      this.oauthService.loadDiscoveryDocumentAndLogin(LoginOptions);
    }

    // Optional
    //this.oauthService.setupAutomaticSilentRefresh();
  }
}
