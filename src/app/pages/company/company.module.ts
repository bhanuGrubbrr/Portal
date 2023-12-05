import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MaterialModules } from 'src/app/material.module';
import { WidgetsModule } from 'src/app/metronic/_metronic/partials';
import { SharedModule } from 'src/app/shared/shared.module';
import { CompanyAccessAddUserModalComponent } from './company-access-add-user/company-access-add-user.component';
import { CompanyAccessComponent } from './company-access/company-access.component';
import { CompanyRoutingModule } from './company-routing.module';
import { LocationListComponent } from './location-list/location-list.component';
// import { CompanymodalComponent } from './modal/companymodal/companymodal.component'
import { CompanyAccessRemoveModalComponent } from './company-access-remove-user-modal/company-access-remove-user-modal.component';
import { CompanyAccessEditUserModalComponent } from './company-access-edit-user-modal/company-access-edit-user-modal.component';
import { CompanyLoyaltyComponent } from './company-loyalty/company-loyalty.component';
import { CompanyKioskDesignerComponent } from './company-kiosk-designer/company-kiosk-designer.component';
import { CompanyKioskDesignerMenuComponent } from './company-kiosk-designer-menu/company-kiosk-designer-menu.component';
import { CompanyKioskDesignerMenuAddComponent } from './company-kiosk-designer-menu-add/company-kiosk-designer-menu-add.component';
import { LocationListEditorComponent } from './company-kiosk-designer-menu-add/location-list-editor/location-list-editor.component';
import { CompanyKioskDesignerItemsComponent } from './company-kiosk-designer-items/company-kiosk-designer-items.component';
import { CompanyKioskDesignerItemsEditComponent } from './company-kiosk-designer-items-edit/company-kiosk-designer-items-edit.component';
import { CompanyKioskDesignerCategoryComponent } from './company-kiosk-designer-category/company-kiosk-designer-category.component';
import { CompanyKioskDesignerCategoryAddComponent } from './company-kiosk-designer-category-add/company-kiosk-designer-category-add.component';
import { CompanyKioskDesignerModifierGroupComponent } from './company-kiosk-designer-modifier-group/company-kiosk-designer-modifier-group.component';
import { CompanyKioskDesignerModifierGroupAddComponent } from './company-kiosk-designer-modifier-group-add/company-kiosk-designer-modifier-group-add.component';
import { FeaturesComponent } from './features/features.component';

@NgModule({
  declarations: [
    CompanyAccessComponent,
    CompanyAccessAddUserModalComponent,
    LocationListComponent,
    // CompanymodalComponent,
    CompanyAccessRemoveModalComponent,
    CompanyAccessEditUserModalComponent,
    CompanyLoyaltyComponent,
    CompanyKioskDesignerComponent,
    CompanyKioskDesignerMenuComponent,
    CompanyKioskDesignerMenuAddComponent,
    LocationListEditorComponent,
    CompanyKioskDesignerItemsComponent,
    CompanyKioskDesignerItemsEditComponent,
    CompanyKioskDesignerCategoryComponent,
    CompanyKioskDesignerCategoryAddComponent,
    CompanyKioskDesignerModifierGroupComponent,
    CompanyKioskDesignerModifierGroupAddComponent,
    FeaturesComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    CompanyRoutingModule,
    WidgetsModule,
    SharedModule,
    MaterialModules,
  ],
})
export class CompanyModule {}
