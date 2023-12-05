import { version } from './version';
import { theme } from './theme';

export const environment = {
  production: true,
  retryAttempts: 1,
  appVersion: version.Version,

  auth0ClientId: 'a3o13sb4PYphNhrnNQv5OF4hfVHVNrVN',
  auth0Issuer: 'https://test-identity-grubbrr.us.auth0.com/',
  auth0Audience: 'grubbrr-nge-api',
  auth0ReturnUrl: 'https://test.nge.grubbrr.com/welcome',

  apiUrl: 'https://test.api.nge.grubbrr.com/api',
  graphqlUrl: 'https://test.api.nge.grubbrr.com/graphql',
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
