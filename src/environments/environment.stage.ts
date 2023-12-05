import { version } from './version';
import { theme } from './theme';

export const environment = {
  production: true,
  retryAttempts: 1,
  appVersion: version.Version,

  auth0ClientId: '8jTxCkdL3MvAW2oU703Bs7Bzkl1gLUsL',
  auth0Issuer: 'https://stg-grubbrr-identity.us.auth0.com/',
  auth0Audience: 'grubbrr-nge-api',
  auth0ReturnUrl: 'https://stage.nge.grubbrr.com/welcome',

  apiUrl: 'https://stage.api.nge.grubbrr.com/api',
  graphqlUrl: 'https://stage.api.nge.grubbrr.com/graphql',
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
