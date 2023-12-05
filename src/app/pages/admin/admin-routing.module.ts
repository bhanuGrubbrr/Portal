import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenAuthGuard } from 'src/app/shared/auth.guard';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { ConnectorsComponent } from './connectors/connectors.component';
import { LoyaltyIntegrationsComponent } from './loyalty-integrations/loyalty-integrations.component';

const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: 'company/add',
    component: CompanyEditComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: 'company/:companyid',
    component: CompanyEditComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: 'company',
    component: CompanyListComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: 'users',
    component: AdminUsersComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: 'connectors',
    component: ConnectorsComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: 'loyalty',
    component: LoyaltyIntegrationsComponent,
    canActivate: [TokenAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
