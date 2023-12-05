import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { LocationBaseVM } from 'src/app/grubbrr/generated/locations_pb';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { CompanyService } from 'src/app/grubbrr/service/company.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-company-kiosk-designer-menu',
  templateUrl: './company-kiosk-designer-menu.component.html',
  styleUrls: ['./company-kiosk-designer-menu.component.scss'],
})
export class CompanyKioskDesignerMenuComponent implements OnInit {
  @Input() companyId: string;
  loaded: boolean = false;
  searchQuery = '';
  statusFilter = 1;
  location = 'all';
  menus: any = [];
  allMenus: any = [];
  locations: LocationBaseVM[];

  constructor(
    private locationService: LocationService,
    private companyService: CompanyService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchLocations();
    this.fetchCompanyMenus();
  }

  async fetchLocations() {
    this.loaded = false;
    this.locations = (
      await this.locationService.getLocations(this.companyId)
    ).locations;
    this.loaded = true;
    this.cdr.detectChanges();
  }

  async fetchCompanyMenus() {
    this.loaded = false;
    this.allMenus = await this.companyService.getCompanyMenus(this.companyId);
    this.menus = this.allMenus;
    if (this.statusFilter == 1) {
      this.menus = this.allMenus.filter((item: any) => item.isActive);
    } else if (this.statusFilter == 2) {
      this.menus = this.allMenus.filter((item: any) => !item.isActive);
    }
    this.loaded = true;
    this.cdr.detectChanges();
  }

  handleSearchChange() {}

  changeStatusFilter() {
    this.menus = this.allMenus;
    if (this.statusFilter == 1) {
      this.menus = this.allMenus.filter((item: any) => item.isActive);
    } else if (this.statusFilter == 2) {
      this.menus = this.allMenus.filter((item: any) => !item.isActive);
    }
  }

  changeLocation() {}

  drop(arr: Array<any>, event: CdkDragDrop<string[]>) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
  }

  onChangeActiveStatus() {}
}
