import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  LocationFeatures,
  LocationIdService,
} from 'src/app/grubbrr/service/location-id.service';
import { UtilService } from 'src/app/grubbrr/service/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-location-aside-menu',
  templateUrl: './location-aside-menu.component.html',
  styleUrls: ['./location-aside-menu.component.scss'],
})
export class LocationAsideMenuComponent implements OnInit, OnDestroy {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  companyId: string;
  locationId: string;
  locationFeatures: LocationFeatures | undefined;
  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utilService: UtilService,
    private locationIdService: LocationIdService
  ) {}

  ngOnInit(): void {
    this.grubbrrRoutingChanges();
  }

  grubbrrRoutingChanges() {
    this.subscriptions.push(
      this.utilService.GrubbrrRouteParams$.subscribe((routeParams) => {
        if (!routeParams) {
          return;
        }
        this.locationId = routeParams.locationId ?? '';
        this.companyId = routeParams.companyId ?? '';

        // Checks if locationId is not null && blank
        if (this.locationId) this.onLocationChanged();
      })
    );
  }

  async onLocationChanged() {
    this.locationFeatures = await this.locationIdService.getKioskFeatureStatus(
      this.locationId
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  getEncodedURL() {
    return btoa(this.router.url.split('?backurl=')[0]);
  }
}
