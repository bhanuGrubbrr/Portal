import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LocationStaffModel } from 'src/app/grubbrr/core/models/location/locationstaff.model';
import {
  LocationStaffVM,
  StaffVM,
} from 'src/app/grubbrr/generated/locations_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { UtilService } from 'src/app/grubbrr/service/utils.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout';

@Component({
  selector: 'app-location-staff-edit',
  templateUrl: './location-staff-edit.component.html',
  styleUrls: ['./location-staff-edit.component.scss'],
})
export class LocationStaffEditComponent implements OnInit, OnDestroy {
  staffForm: FormGroup;
  saving: boolean = false;
  formReady: boolean = false;
  locationId: string;
  staffId: string;
  pageTitle: string = '';
  showPassword: string = 'password';
  locationStaff: StaffVM;
  private subscriptions: Subscription[] = [];

  constructor(
    public navigation: NavigationService,
    private toastr: ToastrService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private util: UtilService,
    private fb: FormBuilder,
    private pageService: PageInfoService,
    private breadCrumbService: BreadCrumbService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    this.initForm();
    this.initVars();
  }

  initForm() {
    this.staffForm = this.fb.group({
      name: this.fb.control('', Validators.required),
      accessCode: this.fb.control('', [
        Validators.minLength(4),
        Validators.required,
        Validators.pattern(/^[0-9]\d*$/),
      ]),
      id: this.fb.control(''),
    });
  }

  private async initVars() {
    if (this.staffId) {
      this.locationStaff =
        (await this.locationService.getStaff(this.locationId)).staff.find(
          (s) => s.id == this.staffId
        ) ?? ({} as StaffVM);
      this.loader.stop();
      this.formReady = true;
      this.cdr.detectChanges();
      this.staffForm.patchValue(this.locationStaff);
    }

    this.formReady = true;
  }

  async onSubmit() {
    if (this.staffForm.invalid) {
      this.toastr.warning('Please correct validation issues');
      return;
    } else {
      this.loader.start();
      this.saving = true;

      try {
        this.locationStaff =
          (
            await this.locationService.addStaff(
              this.locationId,
              this.staffForm.getRawValue() as StaffVM
            )
          ).staff.find((s) => s.id == this.staffId) ?? ({} as StaffVM);
        this.staffForm.patchValue(this.locationStaff);
        this.toastr.success('Staff member updated');

        this.loader.stop();
        this.saving = false;
        this.cdr.detectChanges();
        //      this.toastr.error('Unable to save Staff Member. Please try again.');
      } catch (ex: any) {
        if (ex instanceof Error)
          this.toastr.error('There was an error: ' + ex.message);
        else this.toastr.error('There was an error');
        this.loader.stop();
        this.saving = false;
        this.cdr.detectChanges();
      }
    }
  }

  get f() {
    return this.staffForm.controls;
  }

  togglePassword(): void {
    if (this.showPassword == 'password') {
      this.showPassword = 'text';
    } else {
      this.showPassword = 'password';
    }
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.staffId = this.route.snapshot.params.staffId;

    this.pageTitle = 'Location Staff Edit';

    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId,
      this.pageTitle
    );

    this.pageService.updateTitle('Staff Edit');
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
