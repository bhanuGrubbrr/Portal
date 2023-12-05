import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationSetupModel } from 'src/app/grubbrr/core/models/location/locationsetup.model';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout/core/page-info.service';
@Component({
  selector: 'app-location-home',
  templateUrl: './location-home.component.html',
  styleUrls: ['./location-home.component.scss'],
})
export class LocationHomeComponent implements OnInit, OnDestroy {
  companyId: string;
  companyName: string;
  locationId: string;
  locationName: string;
  locationSetup: LocationSetupModel;
  pageTitle: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private pageService: PageInfoService,
    private breadCrumbService: BreadCrumbService,
    public navigation: NavigationService
  ) {}

  ngOnInit(): void {
    this.setupPageTitle();
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = 'Location Home';

    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId,
      this.pageTitle
    );

    this.pageService.updateTitle(this.pageTitle);
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
