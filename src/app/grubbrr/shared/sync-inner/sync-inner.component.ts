import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import {
  BehaviorSubject,
  Subscription,
  interval,
  switchMap,
  takeWhile,
  firstValueFrom,
  Subject,
  takeUntil,
} from 'rxjs';
import { RemoteSync } from '../../service/kiosks.service';
import { LocationPosService } from '../../service/location-pos.service';
import { SyncStatus } from '../../service/menu.service';
import { MenuComponent } from 'src/app/metronic/_metronic/kt/components';
@Component({
  selector: 'app-sync-inner',
  templateUrl: './sync-inner.component.html',
  styleUrls: ['./sync-inner.component.scss'],
})
export class SyncInnerComponent implements OnDestroy {
  @HostBinding('class')
  class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-300px`;
  @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

  private unsubscribe: Subscription[] = [];
  private _locationId: string;

  @Input() isSyncing = false;
  submitted = false;
  currentSyncStatus: string;
  lastSyncDate: Date;
  status: BehaviorSubject<SyncStatus> = new BehaviorSubject<SyncStatus>(
    new SyncStatus()
  );
  private destroy$ = new Subject<void>();

  constructor(
    private locationPosService: LocationPosService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() set locationId(locationId: string) {
    this._locationId = locationId;
    if (this._locationId) {
      this.pollUntilCompleted();
    }
  }

  pollUntilCompleted(refreshKiosk = false) {
    if (this._locationId) {
      interval(1000)
        .pipe(
          switchMap(() =>
            this.locationPosService.pollingSyncMenu(this._locationId)
          ),
          takeUntil(this.destroy$)
        )
        .subscribe((syncStatus) => {
          if (this.isStatusCompleted(syncStatus)) {
            this.destroy$.next(); // Stop polling
            if (refreshKiosk) {
              this.syncMenuToKiosks();
            } else if (this.isSyncing) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                key: 'topcenter',
                detail: 'POS Sync Completed',
              });
              this.isSyncing = false;
              this.cdr.detectChanges();
            }
          }
        });
    }
  }
  hideMenu() {
    const item = document.querySelector('#sync-btn');
    const menu = MenuComponent.getInstance(item as HTMLElement);
    menu.hide(item);
  }
  async syncMenu(refreshKiosk = false) {
    this.submitted = true;
    this.isSyncing = true;
    this.hideMenu();
    if (!this._locationId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        key: 'topcenter',
        detail: 'Location Id is required',
      });
      return;
    }

    const response = await firstValueFrom(
      this.locationPosService.syncPosMenu(this._locationId)
    );

    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      key: 'topcenter',
      detail: 'POS Sync Queued',
    });

    if (response) {
      this.pollUntilCompleted(refreshKiosk);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        key: 'topcenter',
        detail: 'Menu sync failed',
      });
    }
  }

  async syncMenuToKiosks() {
    this.isSyncing = true;
    this.hideMenu();
    const response = await RemoteSync(this._locationId);

    const successMessage = response
      ? 'Sync Request for kiosks has been added to the queue'
      : 'Sync Request for kiosks Failed';
    const severity = response ? 'success' : 'error';

    this.messageService.add({
      severity: severity,
      summary: response ? 'Success' : 'Error',
      key: 'topcenter',
      detail: successMessage,
    });

    this.isSyncing = false;
  }

  private isStatusCompleted(syncStatus: SyncStatus) {
    this.currentSyncStatus = syncStatus.status;
    this.lastSyncDate = syncStatus.lastSynced;
    this.status.next(syncStatus);

    if (syncStatus.status === 'Exception' && this.submitted) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        key: 'topcenter',
        detail: syncStatus.message,
        sticky: true,
      });
      return true;
    }

    this.isSyncing = syncStatus.status === 'Running';
    return syncStatus.status === 'Success' || syncStatus.status === 'Exception';
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
