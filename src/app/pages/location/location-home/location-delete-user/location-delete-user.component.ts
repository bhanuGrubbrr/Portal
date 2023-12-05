import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { findDangerousChanges } from 'graphql';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LocationService } from 'src/app/grubbrr/service/location.service';

@Component({
  selector: 'app-location-delete-user',
  templateUrl: './location-delete-user.component.html',
  styleUrls: ['./location-delete-user.component.scss'],
})
export class LocationDeleteUserComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<string>();
  companyId: string;
  locationId: string;
  modalReference: any;
  deleteUserForm: FormGroup;
  @Input() userId = '';
  @Input() roleName = '';
  @Input() email = '';
  saving: boolean = false;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.initForm();
  }

  initForm() {
    this.deleteUserForm = this.fb.group({
      locationId: this.fb.control(this.locationId),
      userId: this.fb.control(this.userId),
      roleName: this.fb.control(this.roleName),
      email: this.fb.control(this.email),
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

    this.deleteUserForm.controls['userId'].setValue(this.userId);
    this.deleteUserForm.controls['roleName'].setValue(this.roleName);

    try {
      const result = await this.locationService.deleteLocationUserAccess(
        this.locationId,
        this.deleteUserForm.value.userId
      );
      this.toastr.success('User Removed from company');
      this.newItemEvent.emit(this.userId);
    } catch (ex) {
      this.toastr.error('Unable to Remove User Contact Support');
      this.newItemEvent.emit(this.userId);
    } finally {
      this.modalReference.close();
      this.loader.stop();
      this.cdr.detectChanges();
    }
  }
}
