import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BlobReference } from 'src/app/grubbrr/core/models/blobreference';
import { LocationPosService } from 'src/app/grubbrr/service/location-pos.service';
import { CalendarEvent } from 'src/app/grubbrr/shared/calendar-event';

@Component({
  selector: 'app-agent-logs',
  templateUrl: './agent-logs.component.html',
  styleUrls: ['./agent-logs.component.scss'],
})
export class AgentLogsComponent implements OnInit, OnDestroy {
  // Infinite Scroll
  scrolledIndex = 0;
  token: string;
  moreAvailable = false;
  isCurrentlyRunning = false;
  itemsStream$: BehaviorSubject<Array<BlobReference>> = new BehaviorSubject<
    BlobReference[]
  >([]);
  contentLoaded = false;
  @Input() hasPOS = false;
  @Input() posTypeName = '';
  @Input() posDisplayName = '';
  @Input() events$: Observable<CalendarEvent>;
  locationId: string;
  subscriptions: Subscription[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private locationPosService: LocationPosService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.initFetchEvent();
  }

  private initFetchEvent() {
    this.subscriptions.push(
      this.events$.subscribe((event: CalendarEvent) => {
        if (event.action == 'agentLogs') {
          this.fetchData(null, event.dateRangeStart, event.dateRangeEnd);
        }
      })
    );
  }

  scrolledIndexChange(i: number): void {
    this.scrolledIndex = i;

    if (this.moreAvailable && !this.isCurrentlyRunning) {
      this.loader.start();
      this.fetchData(this.token);
    }
  }

  fetchData(
    token: string | null = null,
    startDate: string | null = null,
    endDate: string | null = null
  ) {
    this.subscriptions.push(
      this.locationPosService
        .getAgentLogs(this.locationId, this.posTypeName)
        .pipe(
          finalize(() => {
            this.contentLoaded = true;
            this.isCurrentlyRunning = false;
            this.loader.stop();
            this.cdr.detectChanges();
          })
        )
        .subscribe((agentLogs: BlobReference[]) => {
          agentLogs = agentLogs.map((agentLog) => {
            return {
              name: agentLog.name.split('/')[2],
              lastModified: agentLog.lastModified,
            };
          });

          this.itemsStream$.next(agentLogs);
        })
    );
  }

  open(agentLog: BlobReference) {
    this.loader.start();

    this.subscriptions.push(
      this.locationPosService
        .downloadAgentLog(this.locationId, this.posTypeName, agentLog.name)
        .pipe(
          finalize(() => {
            this.contentLoaded = true;
            this.isCurrentlyRunning = false;
            this.loader.stop();
            this.cdr.detectChanges();
          })
        )
        .subscribe((data: any) => {
          this.downloadData(data, agentLog.name);
        })
    );
  }

  downloadData(data: Blob, fileName: string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    var downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `agentlog_export_${fileName}`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  titleTrackFn = (_: number, item: BlobReference) => item.name;

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
