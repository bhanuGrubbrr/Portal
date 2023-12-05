import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'src/app/grubbrr/generated/menu_pb';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { MenuService } from 'src/app/grubbrr/service/menu.service';
import { NavigationService } from 'src/app/grubbrr/shared/navigation.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout/core/page-info.service';
import { LocationService } from '../../../grubbrr/service/location.service';
type MenuItem86 = MenuItem & { is86: boolean };

export const enum FilterActionEnum {
  IsNot86 = 0,
  Is86 = 1,
  All = 2,
}

@Component({
  selector: 'app-item-availability',
  templateUrl: './item-availability.component.html',
  styleUrls: [
    './item-availability.component.scss',
    '../location-kiosk-designer/shared.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ItemAvailabilityComponent implements OnInit {
  pageTitle: string;
  locationId: string;
  menuItems: MenuItem86[];
  filteredItems: MenuItem86[] = [];
  displayedItems: MenuItem86[] = [];
  searchQuery = '';
  perPage = 25;
  pageIndex = 0;
  filterAction: FilterActionEnum = FilterActionEnum.All;

  contentLoaded = false;
  constructor(
    public navigation: NavigationService,
    public locationService: LocationService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private pageService: PageInfoService,
    private breadCrumbService: BreadCrumbService,
    private menuService: MenuService,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    const unavailableIds = (
      await this.menuService.GetItem86List(this.locationId)
    ).item86List;
    this.menuItems = (
      await this.menuService.getMenu(this.locationId)
    ).effectiveMenu!.menuItems.map((i) =>
      Object.assign({}, i, { is86: !!unavailableIds.find((id) => id === i.id) })
    );
    this.cdr.detectChanges();
    this.refreshDisplayedItems();
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    this.pageTitle = "86'd Items & Modifiers";

    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId,
      this.pageTitle
    );

    this.pageService.updateTitle('86');
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }
  async toggle(item: MenuItem86) {
    item.is86 = !item.is86;
    await this.save();
  }

  async save() {
    let list = this.menuItems.filter((m) => m.is86).map((i) => i.id);
    try {
      await this.menuService.UpdateItem86List(this.locationId, list);
      this.toast.success('Successfully updated 86');
    } catch (ex: any) {
      console.error(ex);
      this.toast.error('There was an error updating 86');
    }
  }
  setDisplayedItems(x: MenuItem86[]) {
    this.displayedItems = x;
    this.cdr.detectChanges();
  }

  refreshDisplayedItems() {
    let items = this.menuItems;
    if (this.searchQuery) {
      const lowerQuery = this.searchQuery.toLowerCase();
      items = items.filter((item) => {
        return (
          item?.name?.toLowerCase().includes(lowerQuery) ||
          item.id.toLowerCase().includes(lowerQuery)
        );
      });
    }
    if (this.filterAction == FilterActionEnum.Is86) {
      items = items.filter((item) => item.is86);
    } else if (this.filterAction == FilterActionEnum.IsNot86) {
      items = items.filter((item) => !item.is86);
    }

    this.filteredItems = items;
    this.contentLoaded = true;
    this.cdr.detectChanges();
  }

  onChangeSearchStatusFilter() {
    this.pageIndex = 0;
    this.refreshDisplayedItems();
  }
}
