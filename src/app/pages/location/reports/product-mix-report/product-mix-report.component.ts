import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Table } from 'primeng/table';
import { firstValueFrom, Subscription } from 'rxjs';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout/core/page-info.service';
import { DATE_FORMAT } from '../../../../core/global-constants';
import { OrderItemOption } from '../../../../grubbrr/core/models/orderrecords.model';
import { MenuSection } from '../../../../grubbrr/service/graphql/reports/menu-builder.model';
import { LocationService } from '../../../../grubbrr/service/location.service';
import {
  MenuCategory,
  MenuService,
} from '../../../../grubbrr/service/menu.service';
import { CustomHeaderComponent } from '../../../../shared/custom-header/custom-header.component';
import { saveAs } from 'file-saver';

interface IProductMixReport {
  Sections: ISection[];
  ModifierTotal: number;
  Prices: number;
  AvgPrices: number;
  GrossTotals: number;
  TotalSold: number;
}

interface ISection extends MenuSection {
  content: ISectionItem[];
  sectionQuantity: number;
  sectionPrice: number;
  sectionAvgPrice: number;
  sectionAmount: number;
  sectionModifierTotal: number;
  sectionTotal: number;
}

interface ISectionItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
  modifierTotal: number;
}

@Component({
  selector: 'app-product-mix-report',
  templateUrl: './product-mix-report.component.html',
  styleUrls: ['./product-mix-report.component.scss'],
})
export class ProductMixReportComponent implements OnInit, OnDestroy {
  locationId: string;
  initialEndDate = new Date();
  initialStartDate = new Date(
    this.initialEndDate.getUTCFullYear(),
    this.initialEndDate.getMonth() - 1,
    this.initialEndDate.getDay()
  );
  readonly CustomHeaderComponent = CustomHeaderComponent;
  DisplaySections: ISection[] = [];
  ProductMixReport: IProductMixReport;
  orderDateLabel: string;
  allCategories: MenuCategory[] = [];
  private subscriptions: Subscription[] = [];

  constructor(
    private pageService: PageInfoService,
    private locationSerice: LocationService,
    protected loader: NgxUiLoaderService,
    private breadCrumbService: BreadCrumbService,
    private route: ActivatedRoute,
    private menuService: MenuService,
    private currencyPipe: CurrencyPipe
  ) {
    const storageStartDate = sessionStorage.getItem(
      'productMixReportRangeStart'
    );
    const storageEndDate = sessionStorage.getItem('productMixReportRangeEnd');
    if (storageStartDate) {
      this.initialStartDate = new Date(storageStartDate);
    }
    if (storageEndDate) {
      this.initialEndDate = new Date(storageEndDate);
    }
  }

  ngOnInit(): void {
    this.ProductMixReport = {} as IProductMixReport;
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    await this.fetchMenuSections();
    await this.fetchOrders(
      this.initialStartDate.toString(),
      this.initialEndDate.toString()
    );
    this.setDateLabel(
      this.initialStartDate.toString(),
      this.initialEndDate.toString()
    );
  }

  async fetchMenuSections() {
    this.allCategories = await this.menuService.getCategories(this.locationId);
  }

  private resetReport() {
    this.ProductMixReport = {
      GrossTotals: 0,
      ModifierTotal: 0,
      AvgPrices: 0,
      Prices: 0,
      TotalSold: 0,
      Sections: [],
    } as IProductMixReport;

    this.ProductMixReport.Sections =
      this.allCategories.map((o) => {
        return {
          content: [],
          sectionQuantity: 0,
          sectionPrice: 0,
          sectionAvgPrice: 0,
          sectionAmount: 0,
          sectionModifierTotal: 0,
          sectionTotal: 0,
          id: o.id,
          name: o.displayName,

          //...o,
        };
      }) ?? [];
  }

  async fetchOrders(startDate: string, endDate: string) {
    const startDateString = formatDate(startDate, 'yyyy-MM-dd', 'en');
    const endDateString = formatDate(endDate, 'yyyy-MM-dd', 'en');
    this.resetReport();

    const orderRecords = await firstValueFrom(
      this.locationSerice.getOrderHistory(
        this.locationId,
        startDateString,
        endDateString
      )
    );

    let orders = orderRecords.orderRecords;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.categoryId === null) {
          return;
        }

        let section = this.findSection(item.categoryId);
        if (section) {
          section.sectionQuantity = section.sectionQuantity + item.quantity;

          section.sectionPrice =
            section.sectionPrice + item.unitPrice * item.quantity;

          section.sectionTotal = section.sectionTotal + item.totalPrice;
          const itemReference = this.findItem(section, item.itemId);
          if (itemReference) {
            itemReference.id = item.itemId;
            itemReference.quantity = itemReference.quantity + item.quantity;
            itemReference.price =
              itemReference.price + item.unitPrice * item.quantity;
            itemReference.total = itemReference.total + item.totalPrice;

            let additionalModifierCosts = 0;

            item.options.forEach((option: OrderItemOption) => {
              additionalModifierCosts =
                additionalModifierCosts + option.price * item.quantity;
            });
            itemReference.modifierTotal =
              itemReference.modifierTotal + additionalModifierCosts;
            section.sectionModifierTotal =
              section.sectionModifierTotal + additionalModifierCosts;
          } else {
            const itemReference = {
              id: item.itemId,
              name: item.name,
              quantity: item.quantity,
              price: item.unitPrice * item.quantity,
              discount: 0,
              total: item.totalPrice,
              modifierTotal: 0,
            };
            item.options.forEach((option: OrderItemOption) => {
              itemReference.modifierTotal =
                itemReference.modifierTotal + option.price * item.quantity;
            });
            section.sectionModifierTotal =
              section.sectionModifierTotal + itemReference.modifierTotal;
            section.content.push(itemReference);
          }
        }
      });
    });

    this.buildDisplaySections();
    this.updateAvgPrices();
  }

  private buildDisplaySections() {
    this.DisplaySections = this.ProductMixReport.Sections.filter((section) => {
      if (section.content.length > 0) {
        this.ProductMixReport.Prices =
          this.ProductMixReport.Prices + section.sectionPrice;
        this.ProductMixReport.ModifierTotal =
          this.ProductMixReport.ModifierTotal + section.sectionModifierTotal;
        this.ProductMixReport.GrossTotals =
          this.ProductMixReport.GrossTotals + section.sectionTotal;
        this.ProductMixReport.TotalSold += section.content.reduce(
          (sum, section) => sum + section.quantity,
          0
        );

        return true;
      } else {
        return false;
      }
    });
  }

  private updateAvgPrices() {
    let totalCount = 0;
    let totalSum = 0;

    this.DisplaySections.forEach((section) => {
      const count = section.content.reduce(
        (acc, section) => acc + section.quantity,
        0
      );
      const sum = section.content.reduce((acc, item) => acc + item.price, 0);
      const avgPrice = count > 0 ? sum / count : 0;
      section.sectionAvgPrice = avgPrice;
      totalCount += count;
      totalSum += sum;
    });

    this.ProductMixReport.AvgPrices =
      totalCount > 0 ? totalSum / totalCount : 0;
  }

  findSection(id: string) {
    for (let section of this.ProductMixReport.Sections) {
      if (section.id == id) {
        return section;
      }
    }
    return null;
  }

  findItem(category: ISection, itemId: string) {
    if (category.content) {
      for (let item of category?.content) {
        if (item.id == itemId) {
          return item;
        }
      }
    }
    return null;
  }

  async fireCalendarEvent(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    sessionStorage.setItem('productMixReportRangeStart', dateRangeStart.value);
    sessionStorage.setItem('productMixReportRangeEnd', dateRangeEnd.value);

    if (dateRangeStart.value && dateRangeEnd.value) {
      this.setDateLabel(dateRangeStart.value, dateRangeEnd.value);
      await this.fetchOrders(dateRangeStart.value, dateRangeEnd.value);
    }
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId
    );

    this.pageService.updateTitle('Dashboard');
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  private setDateLabel(startDate: string, endDate: string) {
    this.orderDateLabel = `${formatDate(
      startDate,
      DATE_FORMAT,
      'en'
    )} - ${formatDate(endDate, DATE_FORMAT, 'en')}`;
  }

  clear(table: Table) {
    table.clear();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  exportCSV(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    import('xlsx').then((xlsx) => {
      let csvContent: any = [];
      this.DisplaySections.forEach((section: ISection) => {
        section?.content?.forEach((Item: ISectionItem) => {
          let Content = {
            ['Category Name']: `${section.name} - (${section.id})`,
            ['Item Name']: `${Item.id} - (${Item.name})`,
            ['Item Quantity']: Item.quantity,
            ['Item Price']: this.currencyPipe.transform(Item.price, 'USD'),
            ['Modifier Price']: this.currencyPipe.transform(
              Item.modifierTotal,
              'USD'
            ),
            ['Item Total']: this.currencyPipe.transform(
              Item.total + Item.modifierTotal,
              'USD'
            ),
          };
          csvContent.push(Content);
        });
      });
      const worksheet = xlsx.utils.json_to_sheet(csvContent);
      this.saveAsFile(
        xlsx.utils.sheet_to_csv(worksheet),
        `Product Mix ${dateRangeStart.value} to ${dateRangeEnd.value}`
      );
    });
  }

  saveAsFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.csv';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });

      saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }
}
