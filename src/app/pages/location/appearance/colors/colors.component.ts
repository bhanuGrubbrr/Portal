import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  KioskColorsVM,
  LoyaltyColorsVM,
} from 'src/app/grubbrr/generated/appearance_pb';
import { AppearanceService } from 'src/app/grubbrr/service/appearance.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent implements OnInit {
  loaded: boolean = false;
  locationId: string;
  kioskColors: KioskColorsVM;
  loyaltyColors: LoyaltyColorsVM;

  constructor(
    private route: ActivatedRoute,
    private appearanceService: AppearanceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.fetchData();
  }

  async fetchData() {
    this.kioskColors = await this.appearanceService.getColors(this.locationId);
    this.loyaltyColors = await this.appearanceService.getLoyaltyColors(
      this.locationId
    );
    this.loaded = true;
  }

  onColorChangedEvent($event: string, key: keyof KioskColorsVM) {
    this.kioskColors[key] = $event.toUpperCase();
  }

  onLoyaltyColorChangedEvent($event: string, key: keyof LoyaltyColorsVM) {
    this.loyaltyColors[key] = $event.toUpperCase();
  }

  async onSave() {
    try {
      await this.appearanceService.updateColors(
        this.locationId,
        this.kioskColors
      );
      await this.appearanceService.updateLoyaltyColors(
        this.locationId,
        this.loyaltyColors
      );
      this.toastr.success('Colors Updated');
    } catch (e: any) {
      this.toastr.error(e.message);
    }
  }
}
