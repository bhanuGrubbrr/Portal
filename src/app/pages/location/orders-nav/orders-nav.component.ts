import { formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { UserService } from 'src/app/grubbrr/service/user.service';
import { CalendarEvent } from 'src/app/grubbrr/shared/calendar-event';
import { PageInfoService } from 'src/app/metronic/_metronic/layout/core/page-info.service';

@Component({
  selector: 'app-orders-nav',
  templateUrl: './orders-nav.component.html',
  styleUrls: ['./orders-nav.component.scss'],
})
export class OrdersNavComponent implements OnInit, OnDestroy {
  locationId: string;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatTabGroup) tabs: MatTabGroup;
  initialStartDate = new Date();
  initialEndDate = new Date();
  fetchOrdersSubject$: BehaviorSubject<CalendarEvent> =
    new BehaviorSubject<CalendarEvent>(new CalendarEvent());
  showPosRecordsTab = false;
  ordersCurrentTabIndex: number = OrdersTabs.Summary;
  @ViewChild('dateRangeStart', { static: false }) dateRangeStartRef: ElementRef;
  @ViewChild('dateRangeEnd', { static: false }) dateRangeEndRef: ElementRef;
  private subscriptions: Subscription[] = [];

  constructor(
    private pageService: PageInfoService,
    private locationSerice: LocationService,
    protected loader: NgxUiLoaderService,
    private breadCrumbService: BreadCrumbService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.ordersCurrentTabIndex =
      parseInt(localStorage.getItem('ordersCurrentTabIndex') ?? '0') || 0;

    // const storageStartDate = sessionStorage.getItem('posOrderRangeStart');
    // const storageEndDate = sessionStorage.getItem('posOrderRangeEnd');

    // if (storageStartDate) {
    //   this.initialStartDate = new Date(storageStartDate);
    // }
    // if (storageEndDate) {
    //   this.initialEndDate = new Date(storageEndDate);
    // }
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    const user = await this.userService.getUserMe();
    this.showPosRecordsTab = user.isAdmin;
    this.fireCalendarEvent();
  }

  public fireCalendarEvent() {
    if (
      this.dateRangeStartRef.nativeElement.value &&
      this.dateRangeEndRef.nativeElement.value
    ) {
      let event: CalendarEvent = {
        action: 'fetch',
        dateRangeStart: this.dateRangeStartRef.nativeElement.value,
        dateRangeEnd: this.dateRangeEndRef.nativeElement.value,
      };
      // sessionStorage.setItem(
      //   'posOrderRangeStart',
      //   this.dateRangeStartRef.nativeElement.value
      // );
      // sessionStorage.setItem(
      //   'posOrderRangeEnd',
      //   this.dateRangeEndRef.nativeElement.value
      // );

      this.fetchOrdersSubject$.next(event);
    }
  }

  tabChanged(newTabIndex: number): void {
    this.ordersCurrentTabIndex = newTabIndex;
    localStorage.setItem(
      'ordersCurrentTabIndex',
      this.ordersCurrentTabIndex?.toString()
    );
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId
    );

    this.pageService.updateTitle('Orders');
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  exportTable() {
    this.subscriptions.push(
      this.locationSerice
        .exportTable(
          this.locationId,
          this.dateRangeStartRef.nativeElement.value + ' 00:00:00',
          this.dateRangeEndRef.nativeElement.value + ' 23:59:59'
        )
        .pipe(
          finalize(() => {
            this.loader.stop();
          })
        )
        .subscribe((data: any) => {
          this.downloadFile(data);
        })
    );
  }

  downloadFile(data: any) {
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;',
    });
    const url = window.URL.createObjectURL(blob);
    var downloadLink = document.createElement('a');
    downloadLink.href = url;
    var afterDate = formatDate(
      this.initialStartDate,
      'yyyy-MM-dd-h-mm-ss',
      'en'
    );
    var beforeDate = formatDate(
      this.initialEndDate,
      'yyyy-MM-dd-h-mm-ss',
      'en'
    );

    downloadLink.download = `order-export-${afterDate}-${beforeDate}`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}

export enum OrdersTabs {
  Summary = 0,
  DetailedView = 1,
  PosOrderRecords = 2,
}
