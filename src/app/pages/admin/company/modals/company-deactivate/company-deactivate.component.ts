import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from 'src/app/grubbrr/service/company.service';

@Component({
  selector: 'app-company-deactivate',
  templateUrl: './company-deactivate.component.html',
  styleUrls: ['./company-deactivate.component.scss'],
})
export class CompanyDeactivateComponent implements OnInit {
  @Input() fromParent: any;
  companyName: string;
  companyId: string;

  constructor(
    public activeModal: NgbActiveModal,
    private companyService: CompanyService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.companyName = this.fromParent.companyName;
    this.companyId = this.fromParent.companyId;
  }

  closeModal(message: string) {
    this.activeModal.close(false);
  }

  async deactivateCompany() {
    try {
      await this.companyService.deactivateCompany(this.companyId);
      this.toast.success(`${this.companyName} has been disabled`);
      this.activeModal.close(true);
    } catch (ex) {
      this.toast.error(
        `Oops - ${this.companyName} could not be disabled - ask for help`
      );
    }
  }
}
