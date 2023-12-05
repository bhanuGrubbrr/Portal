import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RoleAssignmentVM } from 'src/app/grubbrr/generated/accessList_pb';
import { CompanyService } from 'src/app/grubbrr/service/company.service';

@Component({
  selector: 'app-company-access-add-user',
  templateUrl: './company-access-add-user.component.html',
  styleUrls: ['./company-access-add-user.component.scss'],
})
export class CompanyAccessAddUserModalComponent implements OnInit {
  companyUsers: RoleAssignmentVM[] = [];
  newUser: RoleAssignmentVM;
  @Output() newItemEvent = new EventEmitter<string>();
  closeResult = '';
  companyId: string;
  accessList: any = ['FullAccess', 'ReadOnly'];
  isSubmitted = false;
  addUserForm: FormGroup;
  modalReference: any;
  emailNotSame = false;
  saving: boolean = false;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private route: ActivatedRoute
  ) {}

  big: any;

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params.companyid;

    this.initForm();
  }

  initForm() {
    this.addUserForm = this.fb.group({
      companyId: this.fb.control(this.companyId),
      userEmail: this.fb.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ])
      ),
      role: this.fb.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ])
      ),
    });
  }

  open(content: any) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
    });
    this.modalReference.result.then();
  }

  async onSubmit(): Promise<void> {
    this.saving = true;

    if (!this.addUserForm.valid) {
      this.toastr.error('Invalid Inputs');
      return;
    }
    try {
      const result = await this.companyService.addCompanyUserAccess(
        this.companyId,
        this.addUserForm.value.userEmail,
        this.addUserForm.value.role
      );
      this.toastr.success('Added new User to Company');
      this.newItemEvent.emit('');
      this.modalReference.close();
    } catch (ex) {
      console.error(ex);
      this.toastr.error('Unable to Add User Contact Support');
      this.newItemEvent.emit();
    } finally {
      this.loader.stop();
      this.saving = false;
      this.addUserForm.reset();
      this.cdr.detectChanges();
    }
  }
}
