import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CompanyCloneComponent } from './company-clone/company-clone.component';
import { CompanyDeactivateComponent } from './company-deactivate/company-deactivate.component';

@NgModule({
  declarations: [CompanyCloneComponent, CompanyDeactivateComponent],
  imports: [CommonModule],
  exports: [CompanyCloneComponent, CompanyDeactivateComponent],
})
export class AdminModalsModule {}
