import { version } from './version';
import { theme } from './theme';

export const environment = {
  production: true,
  retryAttempts: 1,
  appVersion: version.Version,

  auth0ClientId: 'KkuDRN1fc4IaORpgG2EsI91IAwDUI1N9',
  auth0Issuer: 'https://sandbox-identity-grubbrr.us.auth0.com/',
  auth0Audience: 'grubbrr-nge-api',
  auth0ReturnUrl: 'https://sandbox.nge.grubbrr.com/welcome',

  apiUrl: 'https://sandbox.api.nge.grubbrr.com/api',
  graphqlUrl: 'https://sandbox.api.nge.grubbrr.com/graphql',
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
