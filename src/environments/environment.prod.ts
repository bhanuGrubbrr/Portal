import { version } from './version';
import { theme } from './theme';

export const environment = {
  production: true,
  retryAttempts: 1,
  appVersion: version.Version,

  auth0ClientId: 'MAbnsdSA11WMXs4G5VVaOSw6vMS827MF',
  auth0Issuer: 'https://prod-grubbrr-identity.us.auth0.com/',
  auth0Audience: 'grubbrr-nge-api',
  auth0ReturnUrl: 'https://nge.grubbrr.com/welcome',

  apiUrl: 'https://api.nge.grubbrr.com/api',
  graphqlUrl: 'https://api.nge.grubbrr.com/graphql',
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
