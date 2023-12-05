import { version } from './version';
import { theme } from './theme';

export const environment = {
  production: true,
  retryAttempts: 1,
  appVersion: version.Version,

  auth0ClientId: '2pHzptiJS18cHJtvQJAq7IPyi0kaOzjM',
  auth0Issuer: 'https://dev-hdexa4cq.us.auth0.com/',
  auth0Audience: 'grubbrr-portal-api',
  auth0ReturnUrl:
    'https://app-nge-dev-eastus-core-api.azurewebsites.net/welcome',

  apiUrl: 'https://app-nge-dev-eastus-core-api.azurewebsites.net/api',
  graphqlUrl: 'https://app-nge-dev-eastus-core-api.azurewebsites.net/graphql',
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
