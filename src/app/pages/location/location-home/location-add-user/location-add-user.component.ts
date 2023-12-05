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
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-location-add-user',
  templateUrl: './location-add-user.component.html',
  styleUrls: ['./location-add-user.component.scss'],
})
export class LocationAddUserComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();

  companyUsers: RoleAssignmentVM[] = [];
  newUser: RoleAssignmentVM;
  closeResult = '';
  companyId: string;
  accessList: any = ['FullAccess', 'ReadOnly'];
  isSubmitted = false;
  addUserForm: FormGroup;
  modalReference: any;
  emailNotSame = false;
  test: any;
  big: any;
  locationId: string;
  saving: boolean = false;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.initForm();
  }

  initForm() {
    this.addUserForm = this.fb.group({
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
    this.saving = !this.saving;

    if (!this.addUserForm.valid) {
      this.toastr.error('Invalid Inputs');
      this.saving = false;
      return;
    }

    try {
      const result = await this.locationService.addUserToLocation(
        this.locationId,
        this.addUserForm.value.userEmail,
        this.addUserForm.value.role
      );

      this.toastr.success('Added new User to Company');
      this.newItemEvent.emit('');
      this.modalReference.close();
      this.addUserForm.reset();
    } catch (ex) {
      console.error(ex);
      this.toastr.error('Unable to Add User Contact Support');
    } finally {
      this.loader.stop();
      this.cdr.detectChanges();
      this.saving = false;
    }
  }
}
