import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  constructor(
    private kioskConfigService: KioskConfigService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private loader: NgxUiLoaderService
  ) {}

  public locationId: string;
  public conceptsEnabled: boolean;
  public caloriesEnabled: boolean;
  public itemSpecialRequestEnabled: boolean;
  loaded: boolean = false;

  public async conceptsToggle(locationId: string, conceptsEnabled: boolean) {
    this.loader.start();

    this.conceptsEnabled = !this.conceptsEnabled;
    try {
      await this.kioskConfigService.updateConceptFeatureFlag(
        this.locationId,
        this.conceptsEnabled
      );
      this.loader.stop();
      this.toast.success(
        conceptsEnabled === true
          ? 'Support for multi-concepts disabled.'
          : 'Support for multi-concepts enabled.'
      );
    } catch {
      this.toast.error('Error: Unable to change this setting.');
      this.loader.stop();
    }
  }

  public async caloriesToggle(locationId: string, caloriesEnabled: boolean) {
    this.caloriesEnabled = !this.caloriesEnabled;
    this.loader.start();

    try {
      await this.kioskConfigService.updateShowCaloriesFeatureFlag(
        this.locationId,
        this.caloriesEnabled
      );

      this.loader.stop();

      this.toast.success(
        caloriesEnabled === true ? 'Calories disabled.' : 'Calories enabled.'
      );
    } catch {
      this.toast.error('Error: Unable to change this setting.');
      this.loader.stop();
    }
  }

  public async itemSpecialRequestToggle(
    locationId: string,
    itemSpecialRequestEnabled: boolean
  ) {
    this.itemSpecialRequestEnabled = !this.itemSpecialRequestEnabled;
    this.loader.start();

    try {
      await this.kioskConfigService.updateItemSpecialRequestFeatureFlag(
        this.locationId,
        this.itemSpecialRequestEnabled
      );

      this.loader.stop();

      this.toast.success(
        itemSpecialRequestEnabled === true
          ? 'Item Special Request disabled.'
          : 'Item Special Request enabled.'
      );
    } catch {
      this.toast.error('Error: Unable to change this setting.');
      this.loader.stop();
    }
  }

  async ngOnInit(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    const config = await this.kioskConfigService.getKioskConfig(
      this.locationId
    );
    this.conceptsEnabled = config.conceptsEnabled;
    this.caloriesEnabled = config.caloriesEnabled;
    this.itemSpecialRequestEnabled =
      config.itemSpecialRequestSettings?.enabled ?? false;
    this.loaded = true;
  }
}
