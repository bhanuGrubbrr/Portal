import { TitleCasePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatTooltipDefaultOptions,
} from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxColorsModule } from 'ngx-colors';
import { ToastrModule } from 'ngx-toastr';
import {
  NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
} from 'ngx-ui-loader';
import { ToastModule } from 'primeng/toast';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanyService } from './grubbrr/service/company.service';
import { ErrorIntercept } from './grubbrr/service/httpinterceptor.service';
import { LoggingService } from './grubbrr/service/logging.service';
import { RouterExtService } from './grubbrr/service/router-ext.service';
import { StorageService } from './grubbrr/service/storage.service';
import { UtilService } from './grubbrr/service/utils.service';
import { GrubbrrModule } from './grubbrr/shared/grubbrr/grubbrr.module';
import { NavigationService } from './grubbrr/shared/navigation.service';
import { MaterialModules } from './material.module';
import { AuthCallback } from './pages/auth-callback/auth-callback';
import { DefaultComponent } from './pages/defaultComponent';
import { LogoutComponent } from './pages/logout/logout.component';
import { NoCompanyAccessComponent } from './pages/no-company-access/no-company-access.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AdminAuthGuard } from './shared/admin-auth.guard';
import { TokenAuthGuard } from './shared/auth.guard';
import { AuthenticationService } from './shared/authentication.service';
import { MessageService } from 'primeng/api';
import * as Sentry from '@sentry/angular-ivy';

export const OtherOptions: MatTooltipDefaultOptions = {
  showDelay: 0,
  hideDelay: 0,
  touchGestures: 'auto',
  position: 'before',
  touchendHideDelay: 0,
  disableTooltipInteractivity: true,
};

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    DefaultComponent,
    AuthCallback,
    WelcomeComponent,
    NoCompanyAccessComponent,
  ],
  imports: [
    MaterialModules,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
    }),
    HttpClientModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    NgxColorsModule,
    NgSelectModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    NgxUiLoaderModule.forRoot({
      fastFadeOut: true,
    }),
    NgxUiLoaderRouterModule,
    // import NgxUiLoaderRouterModule. By default, it will show foreground loader.
    // If you need to show background spinner, do as follow:
    // NgxUiLoaderRouterModule.forRoot({ showForeground: false })
    NgxUiLoaderHttpModule, // import NgxUiLoaderHttpModule. By default, it will show background loader.
    FormsModule,
    ToastModule,
    GrubbrrModule,
    // auth
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: [environment.apiUrl],
        sendAccessToken: true,
      },
    }),
  ],
  exports: [ToastModule],
  providers: [
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: false,
      }),
    },
    RouterExtService,
    NgbActiveModal,
    MessageService,
    // grubbrr
    NavigationService,
    CompanyService,
    StorageService,
    LoggingService,
    TitleCasePipe,
    UtilService,
    // auth
    TokenAuthGuard,
    AuthenticationService,
    AdminAuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorIntercept,
      multi: true,
    },
    { provide: OAuthStorage, useValue: localStorage },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: OtherOptions },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
