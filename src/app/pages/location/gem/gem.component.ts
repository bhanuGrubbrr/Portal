import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import '@grubbrr/gem-explorer';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gem',
  templateUrl: './gem.component.html',
  styleUrls: ['./gem.component.scss'],
})
export class GemComponent implements OnInit {
  loading = true;
  token: string | null = null;
  companyId: string;
  locationId: string;
  application: string;
  module: string;
  gemURL: string;

  constructor(
    private route: ActivatedRoute,
    private locationService: LocationService,
    private pageService: PageInfoService
  ) {}

  ngOnInit(): void {
    this.companyId = this.route.snapshot.params.companyid;
    this.locationId = this.route.snapshot.params.locationid;
    this.application = 'nge';
    this.module = 'kiosk';
    this.gemURL = environment.gemURL;
    this.pageService.updateTitle('Events');
    this.fetchToken();
  }

  async fetchToken() {
    const token = await this.locationService.fetchGemAccessToken(
      this.application,
      this.locationId
    );
    this.token = token;
    this.loading = false;
  }
}
