import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthCallback } from './pages/auth-callback/auth-callback';
import { LogoutComponent } from './pages/logout/logout.component';
import { NoCompanyAccessComponent } from './pages/no-company-access/no-company-access.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';

export const routes: Routes = [
  {
    path: 'auth-callback',
    component: AuthCallback,
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
  },
  {
    path: 'noaccess',
    component: NoCompanyAccessComponent,
  },
  {
    path: 'logout',
    component: LogoutComponent,
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./metronic/modules/errors/errors.module').then(
        (m) => m.ErrorsModule
      ),
  },
  {
    path: '',
    loadChildren: () =>
      import('./metronic/_metronic/layout/layout.module').then(
        (m) => m.LayoutModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      paramsInheritanceStrategy: 'always',
      //enableTracing: true,
      scrollPositionRestoration: 'enabled', // or 'top'
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64], // [x, y] - adjust scroll offset
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
