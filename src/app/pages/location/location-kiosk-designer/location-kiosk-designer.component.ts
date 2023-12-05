import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationIdService } from 'src/app/grubbrr/service/location-id.service';

@Component({
  selector: 'app-location-kiosk-designer',
  templateUrl: './location-kiosk-designer.component.html',
  styleUrls: ['./location-kiosk-designer.component.scss'],
})
export class LocationKioskDesignerComponent implements OnInit {
  currentTabIndex: number = KioskDesignerTabs.Menu;
  locationId: string;
  locationName: string;

  constructor(
    private route: ActivatedRoute,
    private LocationIDService: LocationIdService
  ) {
    this.currentTabIndex = 1;
  }

  async ngOnInit(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.locationName = await this.LocationIDService.GetLocationName(
      this.locationId
    );

    const thisContext = this;
    this.route.queryParams.subscribe((params) => {
      thisContext.currentTabIndex = Number(params.tab);
    });
  }

  navChanged(event: any): void {}
}

export enum KioskDesignerTabs {
  Menu = 1,
  Categories = 2,
  Items = 3,
  ModifierGroups = 4,
  Modifiers = 5,
  Upsells = 6,
}
