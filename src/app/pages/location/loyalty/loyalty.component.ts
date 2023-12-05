import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  DiscountTendersVM,
  LoyaltyIntegrationConfigVM,
} from 'src/app/grubbrr/generated/loyalty_pb';
import { LoyaltyService2 } from 'src/app/grubbrr/service/loyaltyService.service';

enum Integrations {
  Punchh = 'Punchh',
  Paytronix = 'Paytronix',
  None = 'No Integration',
}
@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.component.html',
  styleUrls: ['./loyalty.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('150ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class LoyaltyComponent implements OnInit {
  locationId: string;
  loyaltyConfiguration: LoyaltyIntegrationConfigVM;
  discountTenders: DiscountTendersVM;
  selectedTenderOption: string;
  loading = true;
  constructor(
    private route: ActivatedRoute,
    private loyaltyService: LoyaltyService2
  ) {}

  get Integrations() {
    return Integrations;
  }

  get IntegrationType() {
    switch (this.integrationId) {
      case 'int-punchh':
        return Integrations.Punchh;
      case 'int-paytronix':
        return Integrations.Paytronix;
      default:
        return Integrations.None;
    }
  }
  get integrationId() {
    return this.loyaltyConfiguration?.integrationId;
  }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.fetchData();
  }

  async fetchData() {
    const [result, discountTendersVm] = await Promise.all([
      this.loyaltyService.getLocationConfig(this.locationId),
      this.loyaltyService.getDiscountTenders(this.locationId),
    ]);

    this.loyaltyConfiguration = result;
    this.discountTenders = discountTendersVm;
    this.loading = false;
  }

  sortDiscounts() {
    return this.discountTenders.discountTenders.sort((a, b) => {
      return a.name > b.name ? 1 : a.name === b.name ? 0 : -1;
    });
  }
}
