import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RoleAssignmentVM } from 'src/app/grubbrr/generated/accessList_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout';

@Component({
  selector: 'app-location-users',
  templateUrl: './location-users.component.html',
  styleUrls: ['./location-users.component.scss'],
})
export class LocationUsersComponent implements OnInit {
  locationUsers: RoleAssignmentVM[] = [];
  locationId: string;
  pageTitle: string;
  constructor(
    private locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private route: ActivatedRoute,
    private pageService: PageInfoService,
    private breadCrumbService: BreadCrumbService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    this.loadUsers();
  }

  itemCallBack(newItem: string) {
    this.loadUsers();
  }

  private async loadUsers(): Promise<void> {
    this.loader.start();

    try {
      const results = await this.locationService.getLocationsUsers(
        this.locationId
      );
      this.locationUsers = results.list;
    } catch (ex) {
      console.error(ex);
    } finally {
      this.loader.stop();
      this.cdr.detectChanges();
    }
  }
  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = 'Location Access';

    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId
    );

    this.pageService.updateTitle('Access');
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }
}
