import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TokenAuthGuard } from 'src/app/shared/auth.guard';
import { CompanyEditComponent } from '../admin/company/company-edit/company-edit.component';
import { LocationEditComponent } from '../location/location-edit/location-edit.component';
import { CompanyAccessComponent } from './company-access/company-access.component';
import { LocationListComponent } from './location-list/location-list.component';
import { CompanyLoyaltyComponent } from './company-loyalty/company-loyalty.component';
import { CompanyKioskDesignerComponent } from './company-kiosk-designer/company-kiosk-designer.component';
import { CompanyKioskDesignerMenuAddComponent } from './company-kiosk-designer-menu-add/company-kiosk-designer-menu-add.component';
import { CompanyKioskDesignerItemsEditComponent } from './company-kiosk-designer-items-edit/company-kiosk-designer-items-edit.component';
import { CompanyKioskDesignerCategoryAddComponent } from './company-kiosk-designer-category-add/company-kiosk-designer-category-add.component';
import { CompanyKioskDesignerModifierGroupAddComponent } from './company-kiosk-designer-modifier-group-add/company-kiosk-designer-modifier-group-add.component';
import { FeaturesComponent } from './features/features.component';

const routes: Routes = [
  {
    path: '',
    component: LocationListComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: ':companyid',
    component: LocationListComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: ':companyid/access',
    component: CompanyAccessComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: ':companyid/edit',
    component: CompanyEditComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    // Add new company location
    pathMatch: 'full',
    path: ':companyid/location/add',
    component: LocationEditComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: ':companyid/locations',
    component: LocationListComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    path: ':companyid/loyalty',
    component: CompanyLoyaltyComponent,
    canActivate: [TokenAuthGuard],
  },
  {
    pathMatch: 'full',
    path: ':companyid/kiosk-designer/menu',
    component: CompanyKioskDesignerComponent,
  },
  {
    pathMatch: 'full',
    path: ':companyid/kiosk-designer/menu/add',
    component: CompanyKioskDesignerMenuAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':companyid/kiosk-designer/menu/edit/:menuid',
    component: CompanyKioskDesignerMenuAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':companyid/:locationid/kiosk-designer/menu/item/:menuItemId',
    component: CompanyKioskDesignerItemsEditComponent,
  },
  {
    pathMatch: 'full',
    path: ':companyid/:locationid/kiosk-designer/menu/category/add',
    component: CompanyKioskDesignerCategoryAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':companyid/:locationid/kiosk-designer/menu/category/:categoryId',
    component: CompanyKioskDesignerCategoryAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':companyid/:locationid/kiosk-designer/menu/modifier-group/add',
    component: CompanyKioskDesignerModifierGroupAddComponent,
  },
  {
    pathMatch: 'full',
    path: ':companyid/:locationid/kiosk-designer/menu/modifier-group/:modifierGroupId',
    component: CompanyKioskDesignerModifierGroupAddComponent,
  },
  {
    path: ':companyid/features',
    component: FeaturesComponent,
    canActivate: [TokenAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
