import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-location-inheritance-banner',
  templateUrl: './location-inheritance-banner.component.html',
  styleUrls: ['./location-inheritance-banner.component.scss'],
})
export class LocationInheritanceBannerComponent {
  locationId: string;
  @Input() hasParentLocation: boolean;
  @Input() title: string;
  @Input() body: string;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.locationId = this.route.snapshot.params.locationid;
  }

  linkToLocationSettings() {
    var url = 'location/' + this.locationId + '/edit';
    this.router.navigateByUrl(url);
  }
}
