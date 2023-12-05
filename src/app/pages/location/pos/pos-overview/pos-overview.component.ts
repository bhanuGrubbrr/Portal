import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { UserDetailsModel } from 'src/app/grubbrr/core/models/userdetails.model';
import { BreadCrumbService } from 'src/app/grubbrr/service/breadcrumb.service';
import { LocationPosService } from 'src/app/grubbrr/service/location-pos.service';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { UserService } from 'src/app/grubbrr/service/user.service';
import { CalendarEvent } from 'src/app/grubbrr/shared/calendar-event';
import { PageInfoService, PageLink } from 'src/app/metronic/_metronic/layout';

@Component({
  selector: 'app-pos-overview',
  templateUrl: './pos-overview.component.html',
  styleUrls: ['./pos-overview.component.scss'],
})
export class PosOverviewComponent implements OnInit, OnDestroy {
  breadCrumbs: Array<PageLink> = [];
  hasPOS = false;
  hasPosSyncEnabled = false;
  savingSync = false;
  subscriptions: Subscription[] = [];
  posCurrentTabIndex: number = PosTabs.PosHistory;
  fetchHistorySubject$: BehaviorSubject<CalendarEvent> =
    new BehaviorSubject<CalendarEvent>(new CalendarEvent());
  initialStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  initialEndDate = new Date();
  showAgentLogs = false;
  posTypeName: string;
  posDisplayName: string;
  contentLoaded = false;
  locationId: string;
  user: UserDetailsModel;
  refreshing = false;
  disableRefreshButton = true;
  pullingLatestMenu: boolean = false;
  public posSettings: any;
  @ViewChild('dateRangeStart', { static: false }) dateRangeStartRef: ElementRef;
  @ViewChild('dateRangeEnd', { static: false }) dateRangeEndRef: ElementRef;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private locationService: LocationService,
    private loader: NgxUiLoaderService,
    private pageService: PageInfoService,
    private toast: ToastrService,
    private locationPosService: LocationPosService,
    private route: ActivatedRoute,
    private breadCrumbService: BreadCrumbService
  ) {
    this.posCurrentTabIndex =
      parseInt(localStorage.getItem('posCurrentTabIndex') ?? '1') || 1;
  }

  ngOnInit() {
    this.initPage();
  }

  private async initPage() {
    this.setupPageTitle();
    this.user = await this.userService.getUserMe();
    this.checkIfPosIsSetup();
  }

  navChanged(event: any): void {
    this.posCurrentTabIndex = event.nextId;
    localStorage.setItem(
      'posCurrentTabIndex',
      this.posCurrentTabIndex?.toString()
    );

    if (this.hasPOS) {
      this.handleDateEvent();
      var posDef = this.posSettings.allowedDefinitions.find(
        (d: any) =>
          d.posIntegrationId === this.posSettings.config?.posIntegrationId
      );
      const posSyncMetaRecord =
        this.posSettings.posSyncMetaRecordConfig.find(
          (x: any) =>
            x.posIntegrationId == this.posSettings.config?.posIntegrationId
        ) || undefined;

      let posyScyncDefaultRecords = this.posSettings?.posSyncIntegrationConfig;

      this.hasPosSyncEnabled =
        (this.hasPOS && posyScyncDefaultRecords.posIntegrationId !== '') ||
        posSyncMetaRecord !== undefined ||
        false;
    }
  }

  disableSync(event: any): void {
    this.hasPosSyncEnabled = false;
  }

  private handleDateEvent() {
    if (this.hasPOS) {
      let evt: CalendarEvent = {
        action: '',
        dateRangeStart: this.dateRangeStartRef.nativeElement.value,
        dateRangeEnd: this.dateRangeEndRef.nativeElement.value,
      };
      switch (this.posCurrentTabIndex as PosTabs) {
        case PosTabs.PosHistory:
          evt.action = 'fetch';
          this.fetchHistorySubject$.next(evt);
          this.disableRefreshButton = false;
          break;

        case PosTabs.AgentLogs:
          if (this.showAgentLogs) {
            evt.action = 'agentLogs';
            this.fetchHistorySubject$.next(evt);
            this.disableRefreshButton = false;
          }
          break;

        default:
          this.disableRefreshButton = true;
          break;
      }
    }

    this.refreshing = false;
    this.cdr.detectChanges();
  }

  dateRangeChange(
    dateRangeStart: HTMLInputElement,
    dateRangeEnd: HTMLInputElement
  ) {
    if (dateRangeStart.value && dateRangeEnd.value) {
      this.handleDateEvent();
    }
  }

  async checkIfPosIsSetup() {
    this.posSettings = await this.locationService.getLocationPosSettings(
      this.locationId
    );

    let posyScyncDefaultRecords = this.posSettings?.posSyncIntegrationConfig;
    console.log(posyScyncDefaultRecords);
    this.contentLoaded = true;
    this.cdr.detectChanges();
    this.handleDateEvent();

    var posDef = this.posSettings.allowedDefinitions.find(
      (d: any) =>
        d.posIntegrationId === this.posSettings.config?.posIntegrationId
    );
    this.hasPOS = !!posDef;

    const posSyncMetaRecord =
      this.posSettings.posSyncMetaRecordConfig.find(
        (x: any) =>
          x.posIntegrationId == this.posSettings.config?.posIntegrationId
      ) || undefined;
    this.hasPosSyncEnabled =
      (this.hasPOS &&
        (posyScyncDefaultRecords.posIntegrationId !== '' ||
          posSyncMetaRecord !== undefined)) ||
      false;
    if (this.hasPOS) {
      this.posTypeName = posDef!.posIntegrationId;
      this.posDisplayName = posDef!.displayName;
    }
    this.posCurrentTabIndex = PosTabs.SelectPos;
  }

  private async setupPageTitle() {
    this.locationId = this.route.snapshot.params.locationid;
    const breadCrumbInfo = await this.breadCrumbService.getLocationBreadCrumb(
      this.locationId
    );

    this.pageService.updateTitle('Settings > POS');
    this.pageService.updateBreadcrumbs(breadCrumbInfo.breadCrumbs);
  }

  async pullLatestMenu() {
    this.loader.start();
    this.pullingLatestMenu = true;
    try {
      await this.locationService.pullLatestPosMenu(this.locationId);
      this.toast.success('Menu Pulled Successfully');
    } catch {
      this.toast.error(
        'Unable to pull menu at this time. Please try again later.'
      );
    } finally {
      this.pullingLatestMenu = false;
      this.loader.stop();
      this.cdr.detectChanges();
    }
  }

  onSync(): void {
    this.loader.start();
    this.savingSync = true;

    this.locationPosService
      .syncPosMenu(this.locationId)
      .pipe(
        finalize(() => {
          this.cdr.detectChanges();
          this.loader.stop();
          this.savingSync = false;
        })
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.toast.info('Menu Sync Successfully Queued');
        } else {
          this.toast.success(
            'Unable to Menu Sync at this time. Please try again later.'
          );
        }
      });
  }

  onRefresh() {
    this.refreshing = true;
    // Fake timer, make the user feel like something nice is happening
    setTimeout(() => {
      this.handleDateEvent();
    }, 1000);
  }

  posSelected(posTypeId: any): void {
    this.hasPOS = true;
    this.checkIfPosIsSetup();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}

export enum PosTabs {
  PosHistory = 1,
  SelectPos = 2,
  ScheduleTab = 3,
  AgentLogs = 4,
  SyncPos = 5,
}
