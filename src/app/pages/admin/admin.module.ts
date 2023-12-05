import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MaterialModules } from 'src/app/material.module';
import { WidgetsModule } from 'src/app/metronic/_metronic/partials';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminComponent } from './admin.component';
import { CompanyEditComponent } from './company/company-edit/company-edit.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { AdminAddEditModalComponent } from './modals/admin-add-edit-modal/admin-add-edit-modal.component';
import { AdminDeactivateModalComponent } from './modals/admin-deactivate-modal/admin-deactivate-modal.component';
import { ConnectorsComponent } from './connectors/connectors.component';
import { ConnectorEditModalComponent } from './modals/connector-edit-modal/connector-edit-modal.component';
import { ConnectorRemoveModalComponent } from './modals/connector-remove-modal/connector-remove-modal.component';
import { ConnectorStatusComponent } from './modals/connector-status/connector-status.component';
import { LoyaltyIntegrationsComponent } from './loyalty-integrations/loyalty-integrations.component';
import { EditIntegrationComponent } from './modals/edit-integration/edit-integration.component';
import { RemoveIntegrationComponent } from './modals/remove-integration/remove-integration.component';
import { SyncPosModalComponent } from './modals/sync-pos-modal/sync-pos-modal.component';

@NgModule({
  declarations: [
    CompanyListComponent,
    AdminComponent,
    CompanyEditComponent,
    AdminHomeComponent,
    AdminUsersComponent,
    AdminDeactivateModalComponent,
    AdminAddEditModalComponent,
    ConnectorsComponent,
    ConnectorEditModalComponent,
    ConnectorRemoveModalComponent,
    ConnectorStatusComponent,
    LoyaltyIntegrationsComponent,
    EditIntegrationComponent,
    RemoveIntegrationComponent,
    SyncPosModalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    FormsModule,
    TranslateModule.forChild(),
    ReactiveFormsModule,
    WidgetsModule,
    MaterialModules,
  ],
})
export class AdminModule {}
