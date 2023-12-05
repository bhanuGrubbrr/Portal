import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { GlobalConstants } from 'src/app/core/global-constants';
import {
  MenuSync,
  SyncRecord,
} from 'src/app/grubbrr/core/models/menusync.model';
import { MenuServiceService } from 'src/app/grubbrr/service/menu-service.service';
import { CalendarEvent } from 'src/app/grubbrr/shared/calendar-event';
import { MenuSyncDetailModalComponent } from '../../modals/menu-sync-detail-modal/menu-sync-detail-modal.component';

const numberOfRecordsPerPage = 10;

@Component({
  selector: 'app-pos-sync-history',
  templateUrl: './pos-sync-history.component.html',
  styleUrls: ['./pos-sync-history.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class PosSyncHistoryComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  itemsStream$: BehaviorSubject<Array<SyncRecord>> = new BehaviorSubject<
    SyncRecord[]
  >([]);
  scrolledIndex = 0;
  token: string;
  moreAvailable = false;
  subscriptions: Subscription[] = [];
  isCurrentlyRunning = false;
  modalOptions: NgbModalOptions;
  closeResult: string;
  contentLoaded = false;
  locationId: string;
  @Input() events$: Observable<CalendarEvent>;

  constructor(
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private menuSyncService: MenuServiceService,
    private route: ActivatedRoute
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'xl',
      windowClass: 'posSettings',
      scrollable: true,
    };
  }

  ngAfterViewInit(): void {
    this.initFetchEvent();
  }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
  }

  private initFetchEvent() {
    this.subscriptions.push(
      this.events$.subscribe((posEvent: CalendarEvent) => {
        if (posEvent.action == 'fetch') {
          this.fetchSyncRecords(
            null,
            posEvent.dateRangeStart,
            posEvent.dateRangeEnd
          );
        }
      })
    );
  }

  fetchSyncRecords(
    token: string | null = null,
    startDate: string | null = null,
    endDate: string | null = null
  ) {
    this.isCurrentlyRunning = true;

    this.subscriptions.push(
      this.menuSyncService
        .getMenuSyncHistory(
          this.locationId,
          numberOfRecordsPerPage,
          token,
          startDate,
          endDate
        )
        .pipe(
          finalize(() => {
            this.contentLoaded = true;
            this.isCurrentlyRunning = false;
            this.loader.stop();
            this.cdr.detectChanges();
          })
        )
        .subscribe((menuSync: MenuSync) => {
          if (this.token) {
            this.itemsStream$.next([
              ...this.itemsStream$.getValue(),
              ...menuSync.syncRecords,
            ]);
          } else {
            this.itemsStream$.next(menuSync.syncRecords);
          }

          this.token = menuSync.continuationToken;
          this.moreAvailable = menuSync.moreAvailable;
        })
    );
  }

  open(syncRecord: SyncRecord) {
    let params = {
      syncRecord: syncRecord,
    };

    const modalRef = this.modalService.open(
      MenuSyncDetailModalComponent,
      this.modalOptions
    );

    modalRef.componentInstance.fromParent = params;
    modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Closed with: ${reason}`;
      }
    );
  }

  scrolledIndexChange(i: number): void {
    this.scrolledIndex = i;

    if (this.moreAvailable && !this.isCurrentlyRunning) {
      this.loader.start();
      this.fetchSyncRecords(this.token);
    }
  }

  titleTrackFn = (_: number, item: SyncRecord) => item.id;

  get GlobalConstants() {
    return GlobalConstants;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
