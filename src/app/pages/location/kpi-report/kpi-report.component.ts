import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { PageInfoService } from 'src/app/metronic/_metronic/layout/core/page-info.service';
import { DATE_FORMAT } from '../../../core/global-constants';
import { KPIDashboardReportVM } from '../../../grubbrr/generated/reports_pb';
import { ReportsService } from '../../../grubbrr/service/reports.service';
import { CustomHeaderComponent } from '../../../shared/custom-header/custom-header.component';

export interface reportDataSet {
  labels: string[];
  datasets: Array<dataset>;
}

export interface dataset {
  data: number[];
  hoverOffset: number;
  hoverBorderColor: string;
  hoverBorderWidth: number;
}
@Component({
  selector: 'app-kpi-report',
  templateUrl: './kpi-report.component.html',
  styleUrls: ['./kpi-report.component.scss'],
})
export class KpiReportComponent implements OnInit {
  locationId: string;
  initialEndDate = new Date();
  initialStartDate = new Date(
    this.initialEndDate.getUTCFullYear(),
    this.initialEndDate.getMonth(),
    this.initialEndDate.getDate()
  );
  dateLabel: string;
  report: KPIDashboardReportVM = {
    averageOrder: 0,
    highestOrder: 0,
    lowestOrder: 0,
    totalNumberOfOrders: 0,
    totalTips: 0,
    totalUpsells: 0,
    currencyCode: '',
    localeCode: '',
  };

  loading = true;

  topSellersItemData: reportDataSet;
  topSellersCategoryData: reportDataSet;
  options: any;

  readonly CustomHeaderComponent = CustomHeaderComponent;

  constructor(
    private pageService: PageInfoService,
    private reportsService: ReportsService,
    protected loader: NgxUiLoaderService,
    private breadCrumbService: BreadCrumbService,
    private route: ActivatedRoute
  ) {
    const storageStartDate = sessionStorage.getItem('kpiReportRangeStart');
    const storageEndDate = sessionStorage.getItem('kpiReportRangeEnd');
    if (storageStartDate) {
      this.initialStartDate = new Date(storageStartDate);
    }
    if (storageEndDate) {
      this.initialEndDate = new Date(storageEndDate);
    }
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    await this.fetchKPIReport(
      this.initialStartDate.toString(),
      this.initialEndDate.toString()
    );
  }

  async loadChart() {
    // Defaults
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const hoverOffSet = 30;
    const hoverBorderColor = 'transparent';
    const hoverBorderWidth = 10;

    const itemsLabels = this.report?.topSellersByItem?.reportFields?.map(
      (r) => `${r.label} (${r.value})`
    );
    const itemsDataset = this.report?.topSellersByItem?.reportFields?.map(
      (r) => r.value
    );

    const categoryLabels = this.report?.topSellersByCategory?.reportFields?.map(
      (r) => `${r.label} (${r.value})`
    );
    const categoryDataset =
      this.report?.topSellersByCategory?.reportFields?.map((r) => r.value);

    this.topSellersItemData = {
      labels: itemsLabels ?? [],
      datasets: [
        {
          data: itemsDataset ?? [],
          hoverOffset: hoverOffSet,
          hoverBorderColor: hoverBorderColor,
          hoverBorderWidth: hoverBorderWidth,
        },
      ],
    };

    this.topSellersCategoryData = {
      labels: categoryLabels ?? [],
      datasets: [
        {
          data: categoryDataset ?? [],
          hoverOffset: hoverOffSet,
          hoverBorderColor: hoverBorderColor,
          hoverBorderWidth: hoverBorderWidth,
        },
      ],
    };

    this.options = {
      // This is used when you click, to show as expand
      layout: {
        padding: 30,
      },
      // Boolean - Whether we animate the rotation of the Doughnut
      animateRotate: true,
      // Boolean - Whether we animate scaling the Doughnut from the centre
      animateScale: false,
      cutout: '50%',
      events: ['click'],
      onClick: function (event: any, elements: any, chart: any) {
        const els = chart.getElementsAtEventForMode(
          event,
          'nearest',
          { intersect: true },
          true
        );
        if (els.length && els[0] && !els[0].element.active) {
          chart.setActiveElements([
            {
              datasetIndex: els[0].datasetIndex,
              index: els[0].index,
            },
          ]);
        }
      },
      plugins: {
        legend: {
          position: 'right',
          display: true,
          labels: {
            color: textColor,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
      },
    };

    this.loading = false;
    this.loader.stop();
  }

  async fireCalendarEvent(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    sessionStorage.setItem('productMixReportRangeStart', dateRangeStart.value);
    sessionStorage.setItem('productMixReportRangeEnd', dateRangeEnd.value);

    if (dateRangeStart.value && dateRangeEnd.value) {
      await this.fetchKPIReport(
        dateRangeStart.value + ' 12:00:00',
        dateRangeEnd.value + ' 23:59:59'
      );
    }
  }

  private async fetchKPIReport(startDate: string, endDate: string) {
    this.loader.start();
    this.setDateLabel(startDate, endDate);

    this.report = await this.reportsService.getKPIReport(
      this.locationId,
      startDate,
      endDate
    );

    await this.loadChart();
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
    this.dateLabel = `${formatDate(
      startDate,
      DATE_FORMAT,
      'en'
    )} - ${formatDate(endDate, DATE_FORMAT, 'en')}`;
  }
}
