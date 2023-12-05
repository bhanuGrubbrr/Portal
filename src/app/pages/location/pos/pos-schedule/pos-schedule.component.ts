import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  PosSyncSchedule,
  PosSyncScheduleTracking,
} from '../../../../grubbrr/core/models/possyncschedule';
import { LocationPosService } from '../../../../grubbrr/service/location-pos.service';
import { StorageService } from '../../../../grubbrr/service/storage.service';

@Component({
  selector: 'app-pos-schedule',
  templateUrl: './pos-schedule.component.html',
  styleUrls: ['./pos-schedule.component.scss'],
})
export class PosScheduleComponent implements OnInit, OnDestroy {
  posSyncTrackings: PosSyncScheduleTracking[] = [];
  saving = false;
  contentLoaded = false;
  locationId: string;
  subscriptions: Subscription[] = [];

  daysOfWeek = new Map<number, string>([
    [0, 'Sunday'],
    [1, 'Monday'],
    [2, 'Tuesday'],
    [3, 'Wednesday'],
    [4, 'Thursday'],
    [5, 'Friday'],
    [6, 'Saturday'],
  ]);

  quarterHours = [0, 15, 30, 45];

  constructor(
    private route: ActivatedRoute,
    private locationPosService: LocationPosService,
    private storageService: StorageService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.fetchPosSyncSchedule();
  }

  fetchPosSyncSchedule() {
    const sb = this.locationPosService
      .getPosSyncSchedule(this.locationId)
      .pipe(
        finalize(() => {
          this.contentLoaded = true;
          this.cdr.detectChanges();
        })
      )
      .subscribe((data: PosSyncSchedule) => {
        this.posSyncTrackings = data.trackings.map((t) => {
          t = new PosSyncScheduleTracking({
            daysOfTheWeek: t.daysOfTheWeek,
            scheduleHour: t.scheduleHour,
            scheduleHourQuarter: t.scheduleHourQuarter,
          });
          return t;
        });
      });

    this.subscriptions.push(sb);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  get hoursInDay() {
    return [...Array(13).keys()].slice(1);
  }

  onSubmit() {
    this.saving = true;

    const sb = this.locationPosService
      .updatePosSyncSchedule(
        this.locationId,
        new PosSyncSchedule({ trackings: this.posSyncTrackings })
      )
      .pipe(
        finalize(() => {
          this.saving = false;
          this.cdr.detectChanges();
          this.toast.success('Menu Sync Schedule saved');
        })
      )
      .subscribe((data: PosSyncSchedule) => {
        this.posSyncTrackings = data.trackings.map((t) => {
          t = new PosSyncScheduleTracking({
            daysOfTheWeek: t.daysOfTheWeek,
            scheduleHour: t.scheduleHour,
            scheduleHourQuarter: t.scheduleHourQuarter,
          });
          return t;
        });

        this.subscriptions.push(sb);
      });
  }

  onAddSyncSchedule() {
    this.posSyncTrackings = [
      new PosSyncScheduleTracking({
        daysOfTheWeek: [0, 1, 2, 3, 4, 5, 6],
        scheduleHour: 12,
        scheduleHourQuarter: 0,
      }),
    ].concat(this.posSyncTrackings);
    this.cdr.detectChanges();
  }

  onDayOfWeekSelect(data: PosSyncScheduleTracking, dayOfWeek: number) {
    if (data.daysOfTheWeek.includes(dayOfWeek)) {
      this.removeItem<number>(data.daysOfTheWeek, dayOfWeek);
    } else {
      data.daysOfTheWeek.push(dayOfWeek);
    }
    this.cdr.detectChanges();
  }

  onMeridiemSelect(tracking: PosSyncScheduleTracking, meridiemEvent: Event) {
    let isAM = (<HTMLInputElement>meridiemEvent.target).value === 'am';

    tracking.calcDisplayTime(
      isAM,
      tracking.scheduleHour,
      tracking.scheduleHourQuarter
    );
    this.cdr.detectChanges();
  }

  onHourSelect(tracking: PosSyncScheduleTracking, meridiemEvent: Event) {
    let selectedHour = parseInt((<HTMLInputElement>meridiemEvent.target).value);

    tracking.calcDisplayTime(
      tracking.isAM,
      selectedHour,
      tracking.scheduleHourQuarter
    );
    this.cdr.detectChanges();
  }

  onHourQuarterSelect(tracking: PosSyncScheduleTracking, event: Event) {
    let selectedHourQuarter = parseInt((<HTMLInputElement>event.target).value);
    tracking.calcDisplayTime(
      tracking.isAM,
      tracking.scheduleHour,
      selectedHourQuarter
    );
    this.cdr.detectChanges();
  }

  onDelete(data: PosSyncScheduleTracking) {
    this.removeItem<PosSyncScheduleTracking>(this.posSyncTrackings, data);
    this.cdr.detectChanges();
  }

  removeItem<T>(arr: Array<T>, value: T): Array<T> {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
}
