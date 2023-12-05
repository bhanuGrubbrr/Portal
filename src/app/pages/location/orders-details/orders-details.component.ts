import { Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { OrderSummaryModel } from 'src/app/grubbrr/core/models/orderdetails.model';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { CalendarEvent } from 'src/app/grubbrr/shared/calendar-event';

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss'],
})
export class OrdersDetailsComponent implements OnDestroy, AfterViewInit {
  hide = true;
  locationId: string;
  @Input() events$: Observable<CalendarEvent>;
  afterDate: string;
  beforeDate: string;
  orderSummary: OrderSummaryModel;
  pageTitle: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private locationSerice: LocationService,
    private route: ActivatedRoute
  ) {
    this.locationId = this.route.snapshot.params.locationid;
  }

  fetchData(startDate: string, endDate: string): void {
    this.subscriptions.push(
      this.locationSerice
        .orderSummary(
          this.locationId,
          startDate + ' 00:00:00',
          endDate + ' 23:59:59'
        )
        .pipe(finalize(() => {}))
        .subscribe((data: OrderSummaryModel) => {
          this.orderSummary = data;
        })
    );
  }

  ngAfterViewInit(): void {
    this.initFetchEvent();
  }

  private initFetchEvent() {
    this.subscriptions.push(
      this.events$.subscribe((event: CalendarEvent) => {
        if (
          event.action === 'fetch' &&
          event.dateRangeStart &&
          event.dateRangeEnd
        ) {
          this.fetchData(event.dateRangeStart, event.dateRangeEnd);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
