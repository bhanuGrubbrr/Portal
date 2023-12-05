import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Table } from 'primeng/table';
import { Subscription } from 'rxjs';
import { LocationBaseVM } from 'src/app/grubbrr/generated/locations_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import { PageInfoService, PageLink } from 'src/app/metronic/_metronic/layout';
import { LocationCloneComponent } from '../../location/modals/location-clone/location-clone.component';
import { LocationDeactivateComponent } from '../../location/modals/location-deactivate/location-deactivate.component';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
  styleUrls: ['./location-list.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LocationListComponent implements OnInit, OnDestroy {
  closeModal: any;
  contentLoaded = false;
  companyId: string;
  breadCrumbs: Array<PageLink> = [];
  showPassword: string = 'password';
  pageTitle: string;
  locations: LocationBaseVM[];
  private subscriptions: Subscription[] = [];

  constructor(
    private locationService: LocationService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private breadCrumbService: BreadCrumbService,
    private pageService: PageInfoService,
    public navigation: NavigationService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    this.fetchLocations();
  }

  async fetchLocations() {
    this.contentLoaded = false;
    this.locations = (
      await this.locationService.getLocations(this.companyId)
    ).locations;
    this.contentLoaded = true;
    this.cdr.detectChanges();
  }

  navigateToLocation(locationId: string, locationName: string): void {
    this.router.navigate(['location', locationId, 'dashboard']);
  }

  async openDeactiveModal(locationName: string, locationId: string) {
    let params = {
      locationName: `${locationName}`,
    };

    const modalRef = this.modalService.open(LocationDeactivateComponent, {
      scrollable: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.fromParent = params;
    let result = await modalRef.result;
    if (result == 'success') {
      await this.locationService.removeLocation(locationId);
      await this.fetchLocations();
    }
  }

  openCloneModal(locationName: string) {
    let params = {
      locationName: `${locationName}`,
    };

    const modalRef = this.modalService.open(LocationCloneComponent, {
      scrollable: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then(
      (result: any) => {},
      (reason: any) => {}
    );
  }

  togglePassword(): void {
    if (this.showPassword == 'password') {
      this.showPassword = 'text';
    } else {
      this.showPassword = 'password';
    }
  }

  private async setupPageTitle(): Promise<void> {
    this.companyId = this.route.snapshot.params.companyid;
    this.pageTitle = 'Company Locations';

    const breadCrumbInfo = await this.breadCrumbService.getCompanyBreadCrumb(
      this.companyId
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  clear(table: Table, input: HTMLInputElement) {
    table.clear();
    input.value = '';
  }
}
