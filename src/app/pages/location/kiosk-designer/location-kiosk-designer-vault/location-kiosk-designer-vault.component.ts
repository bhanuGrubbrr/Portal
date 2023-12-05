import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  MenuCategoryWithItems,
  MenuService,
} from 'src/app/grubbrr/service/menu.service';

@Component({
  selector: 'app-location-kiosk-designer-vault',
  templateUrl: './location-kiosk-designer-vault.component.html',
  styleUrls: ['./location-kiosk-designer-vault.component.scss'],
})
export class LocationKioskDesignerVaultComponent implements OnInit {
  locationId: string;

  categories: any[] | undefined;

  constructor(
    private route: ActivatedRoute,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.fetchData();
  }

  async fetchData() {
    this.categories = (
      await this.menuService.getCategoriesWithItems(this.locationId)
    ).map(({ items, ...category }) => {
      return {
        ...category,
        children: items,
      };
    });
  }
}
