import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RoleAssignmentVM } from 'src/app/grubbrr/generated/accessList_pb';
import { CompanyService } from 'src/app/grubbrr/service/company.service';

@Component({
  selector: 'app-company-access-edit-user-modal',
  templateUrl: './company-access-edit-user-modal.component.html',
  styleUrls: ['./company-access-edit-user-modal.component.scss'],
})
export class CompanyAccessEditUserModalComponent implements OnInit {
  accessList: Array<string> = ['FullAccess', 'ReadOnly'];
  realList: any = [];
  companyAccessForm: FormGroup;
  @Input() fromParent: any;
  userRole: RoleAssignmentVM;
  companyId: string;
  modalReference: any;
  saving: boolean = false;
  contentLoaded = false;

  constructor(
    public fb: FormBuilder,
    private toastr: ToastrService,
    private companyService: CompanyService,
    public activeModal: NgbActiveModal
  ) {
    this.companyAccessForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initPage();
  }

  initForm() {
    this.accessList.forEach((element) => {
      if (
        element.toLowerCase() !==
        this.userRole.role?.name.toString().toLowerCase()
      ) {
        this.realList.push(element);
      }
    });

    this.companyAccessForm = this.fb.group({
      companyId: this.fb.control(this.companyId),
      userId: this.fb.control(this.userRole.userId),
      role: this.fb.control(this.userRole.role?.name),
    });

    this.contentLoaded = true;
  }

  async onSubmit(): Promise<void> {
    this.saving = true;

    try {
      await this.companyService.updateCompanyUserAccess(
        this.companyId,
        this.userRole.userId,
        this.companyAccessForm.value.role
      );
      this.toastr.success('User access updated for company');
      this.activeModal.close();
    } catch (ex) {
      console.error(ex);
      this.toastr.error('Unable to Add User Contact Support');
    } finally {
      this.saving = false;
    }
  }

  private initPage() {
    this.userRole = this.fromParent.userRole;
    this.companyId = this.fromParent.companyId;

    this.initForm();
  }
}
