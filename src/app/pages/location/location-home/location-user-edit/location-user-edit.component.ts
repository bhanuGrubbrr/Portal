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
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout';

@Component({
  selector: 'app-location-user-edit',
  templateUrl: './location-user-edit.component.html',
  styleUrls: ['./location-user-edit.component.scss'],
})
export class LocationUserEditComponent implements OnInit {
  saving: boolean = false;
  @Output() newItemEvent = new EventEmitter<string>();
  companyId: string;
  modalReference: any;
  locationId: string;
  pageTitle: string;
  editUserForm: FormGroup;
  @Input() inputUserId = '';
  @Input() roleName = '';
  @Input() email = '';
  accessList: Array<string> = ['FullAccess', 'ReadOnly'];
  realList: any = [];

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private pageService: PageInfoService,
    private breadCrumbService: BreadCrumbService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    this.initForm();
  }

  initForm() {
    this.accessList.forEach((element) => {
      if (element.toLowerCase() !== this.roleName.toString().toLowerCase()) {
        this.realList.push(element);
      }
    });

    this.editUserForm = this.fb.group({
      userId: this.fb.control(this.inputUserId),
      role: this.fb.control(''),
      locationId: this.fb.control(this.locationId),
    });
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = 'Edit User Access';

    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId,
      this.pageTitle
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
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

    if (this.editUserForm.value.roleName == this.roleName) {
      this.toastr.error('User Already Has that Access Type');
      return;
    }
    try {
      const sb = await this.locationService.updateLocationUserAccess(
        this.locationId,
        this.editUserForm.value.userId,
        this.editUserForm.value.role
      );
      this.toastr.success('Added new User to Company');
      this.newItemEvent.emit('');
    } catch (ex) {
      this.toastr.error('Unable to Add User Contact Support');
    } finally {
      this.saving = false;
      this.modalReference.close();
      this.loader.stop();
      this.cdr.detectChanges();
    }
  }
}
