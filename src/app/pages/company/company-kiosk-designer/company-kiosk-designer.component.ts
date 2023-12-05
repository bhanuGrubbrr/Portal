import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LocationIdService } from 'src/app/grubbrr/service/location-id.service';
@Component({
  selector: 'app-company-kiosk-designer',
  templateUrl: './company-kiosk-designer.component.html',
  styleUrls: ['./company-kiosk-designer.component.scss'],
})
export class CompanyKioskDesignerComponent implements OnInit {
  currentTabIndex: number = KioskDesignerTabs.Menu;
  companyId: string;
  companyName: string;

  constructor(
    private route: ActivatedRoute,
    private locationIdService: LocationIdService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentTabIndex = 1;
  }

  async ngOnInit() {
    this.companyId = this.route.snapshot.params.companyid;
    this.route.queryParams.subscribe((params) => {
      this.currentTabIndex = Number(params.tab);
    });
    this.companyName = await this.locationIdService.GetCompanyName(
      this.companyId
    );
    this.cdr.detectChanges();
  }
}

export enum KioskDesignerTabs {
  Menu = 1,
  Categories = 2,
  Items = 3,
  ModifierGroups = 4,
}
