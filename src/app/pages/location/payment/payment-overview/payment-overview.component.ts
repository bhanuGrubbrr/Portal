import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TenderMappingModel } from 'src/app/grubbrr/core/models/TenderMappingModel';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { PageInfoService, PageLink } from 'src/app/metronic/_metronic/layout';

@Component({
  selector: 'app-payment-overview',
  templateUrl: './payment-overview.component.html',
  styleUrls: ['./payment-overview.component.scss'],
})
export class PaymentOverviewComponent implements OnInit, OnDestroy {
  breadCrumbs: Array<PageLink> = [];
  locationId: string;
  paymentCurrentTabIndex: number = 0;
  tenderSettingsRequired = false;
  tenderSetting: TenderMappingModel;
  tenderSettingSubject$: BehaviorSubject<any> = new BehaviorSubject('init');
  subscriptions: Subscription[] = [];

  constructor(
    private pageService: PageInfoService,
    private route: ActivatedRoute,
    private breadCrumbService: BreadCrumbService
  ) {
    this.paymentCurrentTabIndex =
      parseInt(localStorage.getItem('paymentCurrentTabIndex') ?? '0') || 0;
  }

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    await this.setupPageTitle();
    //this.fetchTenderSettings();
  }

  // fetchTenderSettings() {
  //   this.subscriptions.push(
  //     this.paymentService
  //       .getTenderDefinitions(this.locationId)
  //       .pipe(
  //         finalize(() => {
  //           this.cdr.detectChanges();
  //         })
  //       )
  //       .subscribe((tenderSetting: TenderMappingModel) => {
  //         if (tenderSetting == null) {
  //           this.toast.warning('Please setup your Pos first');
  //         }

  //         this.tenderSetting = tenderSetting;
  //         this.tenderSettingsRequired =
  //           this.tenderSetting?.showTenderMappingUI;
  //         if (this.tenderSettingsRequired) {
  //           this.tenderSettingSubject$.next('fetch');
  //         } else {
  //           this.tabChanged(0); // make sure they aren't on the tender mapping tab
  //         }
  //       })
  //   );
  // }

  tenderSettingsSupportedEvent(event: boolean) {
    this.tenderSettingsRequired = event;
  }

  tabChanged(newTabIndex: number): void {
    this.paymentCurrentTabIndex = newTabIndex;

    localStorage.setItem(
      'paymentCurrentTabIndex',
      this.paymentCurrentTabIndex?.toString()
    );
  }

  private async setupPageTitle(): Promise<void> {
    this.locationId = this.route.snapshot.params.locationid;
    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId
    );

    this.pageService.updateTitle('Payments > Settings');
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
