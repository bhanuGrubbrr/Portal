import { Routes } from '@angular/router';
import { AdminAuthGuard } from '../shared/admin-auth.guard';
import { TokenAuthGuard } from '../shared/auth.guard';
import { DefaultComponent } from './defaultComponent';

const MetronicRouting: Routes = [
  {
    path: 'admin',
    canActivate: [AdminAuthGuard],
    loadChildren: () =>
      import('../pages/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'company',
    canActivate: [TokenAuthGuard],
    loadChildren: () =>
      import('../pages/company/company.module').then((m) => m.CompanyModule),
  },
  {
    path: 'location',
    canActivate: [TokenAuthGuard],
    loadChildren: () =>
      import('../pages/location/location.module').then((m) => m.LocationModule),
  },
  {
    path: '',
    component: DefaultComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { MetronicRouting };
