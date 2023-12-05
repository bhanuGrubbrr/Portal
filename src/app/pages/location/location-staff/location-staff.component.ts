import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LocationStaffModel } from 'src/app/grubbrr/core/models/location/locationstaff.model';
import { LocationStaffVM } from 'src/app/grubbrr/generated/locations_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout';
import { LocationStaffDeactivateComponent } from '../modals/location-staff-deactivate/location-staff-deactivate.component';

@Component({
  selector: 'app-location-staff',
  templateUrl: './location-staff.component.html',
  styleUrls: ['./location-staff.component.scss'],
})
export class LocationStaffComponent implements OnInit, OnDestroy {
  locationStaff: LocationStaffVM;
  locationId: string;
  pageTitle: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private locationService: LocationService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private pageService: PageInfoService,
    private breadCrumbService: BreadCrumbService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    this.fetchLocationStaff();
  }

  async fetchLocationStaff() {
    this.loader.start();

    this.locationStaff = await this.locationService.getStaff(this.locationId);
    this.loader.stop();
  }

  async openDeactiveModal(staffId: string, staffName: string) {
    let params = {
      staffId: `${staffId}`,
      staffName: `${staffName}`,
    };

    const modalRef = this.modalService.open(LocationStaffDeactivateComponent, {
      scrollable: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.fromParent = params;
    let result = await modalRef.result;
    if (result === staffId) {
      try {
        this.loader.start();
        this.locationStaff = await this.locationService.removeStaff(
          this.locationId,
          staffId
        );
        this.loader.stop();
        this.toastr.success('Staff Member Deleted');
      } catch (ex: any) {
        this.toastr.error('Unable to delete Staff Member');
      }
    }
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = 'Location Staff';
    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId,
      this.pageTitle
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
