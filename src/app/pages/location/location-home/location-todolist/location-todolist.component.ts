import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LocationSetupStatusVM } from 'src/app/grubbrr/generated/locations_pb';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PageLink } from 'src/app/metronic/_metronic/layout';

@Component({
  selector: 'app-location-todolist',
  templateUrl: './location-todolist.component.html',
  styleUrls: ['./location-todolist.component.scss'],
})
export class LocationToDoListComponent implements OnInit {
  locationId: string;
  companyId: string;
  locationSetup: LocationSetupStatusVM;
  breadCrumbs: Array<PageLink> = [];
  isNCRPOS: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private locationService: LocationService,
    private loader: NgxUiLoaderService,
    private route: ActivatedRoute
  ) {
    this.loader.start();
    this.locationId = this.route.snapshot.params.locationid;
  }

  ngOnInit(): void {
    this.fetchLocationOverview();
  }

  async fetchLocationOverview() {
    this.locationSetup = await this.locationService.getLocationSetupStatus(
      this.locationId
    );
    this.isNCRPOS = await this.locationService.checkIfNCR(this.locationId);

    this.cdr.detectChanges();
    this.loader.stop();
  }
}
