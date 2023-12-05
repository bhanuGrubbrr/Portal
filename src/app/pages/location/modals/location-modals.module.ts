import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocationCloneComponent } from './location-clone/location-clone.component';
import { LocationDeactivateComponent } from './location-deactivate/location-deactivate.component';
import { LocationStaffDeactivateComponent } from './location-staff-deactivate/location-staff-deactivate.component';
import { KioskOnboardCodeComponent } from './kiosk-onboard-code/kiosk-onboard-code.component';
import { UnlinkKioskComponent } from './unlink-kiosk/unlink-kiosk.component';
import { ConfirmRemoveComponent } from './confirm-remove/confirm-remove.component';
import { AddEditConceptComponent } from './add-edit-concept/add-edit-concept.component';
import { DeletePrinterModelComponent } from './delete-printer-model/delete-printer-model.component';

@NgModule({
  declarations: [
    LocationCloneComponent,
    LocationDeactivateComponent,
    LocationStaffDeactivateComponent,
    KioskOnboardCodeComponent,
    UnlinkKioskComponent,
    ConfirmRemoveComponent,
    DeletePrinterModelComponent,
  ],
  imports: [CommonModule],
})
export class LocationModalsModule {}
