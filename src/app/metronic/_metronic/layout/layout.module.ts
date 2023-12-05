import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ToastModule } from 'primeng/toast';
import { SharedModule } from 'src/app/shared/shared.module';
import { MetronicRouting } from '../../../pages/metronic-routing';
import { TranslationModule } from '../../modules/i18n';
import { DrawersModule, DropdownMenusModule, ModalsModule } from '../partials';
import { ExtrasModule } from '../partials/layout/extras/extras.module';
import { AdminAsideMenuComponent } from './components/aside/aside-menu/admin-aside-menu/admin-aside-menu.component';
import { AsideMenuComponent } from './components/aside/aside-menu/aside-menu.component';
import { CompanyAsideMenuComponent } from './components/aside/aside-menu/company-aside-menu/company-aside-menu.component';
import { LocationAsideMenuComponent } from './components/aside/aside-menu/location-aside-menu/location-aside-menu.component';
import { NavLinkComponent } from './components/aside/aside-menu/location-aside-menu/nav-link/nav-link.component';
import { AsideComponent } from './components/aside/aside.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderMenuComponent } from './components/header/header-menu/header-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { PageTitleComponent } from './components/header/page-title/page-title.component';
import { ScriptsInitComponent } from './components/scripts-init/scripts-init.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: MetronicRouting,
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    AsideComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    ScriptsInitComponent,
    ToolbarComponent,
    AsideMenuComponent,
    TopbarComponent,
    PageTitleComponent,
    HeaderMenuComponent,
    AdminAsideMenuComponent,
    CompanyAsideMenuComponent,
    LocationAsideMenuComponent,
    NavLinkComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslationModule,
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    ExtrasModule,
    ModalsModule,
    DrawersModule,
    DropdownMenusModule,
    NgbTooltipModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
  ],
  exports: [RouterModule, ToastModule],
  providers: [],
})
export class LayoutModule {}
