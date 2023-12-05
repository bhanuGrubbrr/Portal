import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// import * as Sentry from "@sentry/angular" // for Angular 10/11 instead
import * as Sentry from '@sentry/angular-ivy';

Sentry.init({
  dsn: 'https://be90540fb030c67e75455d516b6ecd2d@o86468.ingest.sentry.io/4505755799977984',
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      // tracePropagationTargets: ["localhost", "https://test."],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // only send events in deployed environments
  beforeSend(event) {
    if (environment.production) return event;
    return null;
  },
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
