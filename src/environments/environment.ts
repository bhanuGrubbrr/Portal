// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { version } from './version';
import { theme } from './theme';

export const environment = {
  production: false,
  retryAttempts: 0,
  appVersion: version.Version,

  auth0ClientId: '2pHzptiJS18cHJtvQJAq7IPyi0kaOzjM',
  auth0Issuer: 'https://dev-hdexa4cq.us.auth0.com/',
  auth0Audience: 'grubbrr-portal-api',
  auth0ReturnUrl: 'https://localhost:44364/welcome',

  apiUrl: 'api',
  graphqlUrl: 'graphql',
  grpcUrl: '', //intentionally left blank for now
  grpcDebug: true,

  appThemeName: theme.name,
  appPurchaseUrl: theme.purchaseUrl,
  appHTMLIntegration: theme.htmlIntegration,
  appPreviewUrl: theme.previewUrl,
  appPreviewAngularUrl: theme.previewAngularUrl,
  appPreviewDocsUrl: theme.previewDocsUrl,
  appPreviewChangelogUrl: theme.previewChangelogUrl,

  gemURL: 'https://func-gem-api-dev.azurewebsites.net/api/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
