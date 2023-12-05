import {
  AfterViewInit,
  OnDestroy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Table } from 'primeng/table';
import { Observable, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  OrderRecord,
  OrderRecordsModel,
  PaymentDetails,
} from 'src/app/grubbrr/core/models/orderrecords.model';
import { LocationService } from 'src/app/grubbrr/service/location.service';
import { CalendarEvent } from 'src/app/grubbrr/shared/calendar-event';
import { OrderItemsModalComponent } from '../modals/order-items-modal/order-items-modal.component';
@Component({
  selector: 'app-orders-table',
  templateUrl: './orders-table.component.html',
  styleUrls: ['./orders-table.component.scss'],
})
export class OrdersTableComponent implements OnInit, AfterViewInit, OnDestroy {
  allRecords: OrderRecord[] = [];
  displayedRecords: OrderRecord[] = [];
  displayIndexOffset = 0;
  searchQuery = '';

  get isSearching(): boolean {
    return !!this.searchQuery;
  }

  continuationToken: string = '';
  hasMoreRecords = true;
  isCurrentlyRunning = false;
  picker: any;
  closeResult: string;
  locationId: string;
  cols: { field: string; header: string }[] = [];

  @Input() events$: Observable<CalendarEvent>;
  modalOptions: NgbModalOptions;
  private startDate: string;
  private endDate: string;
  private subscriptions: Subscription[] = [];

  private ordersPerPage = 25;

  constructor(
    private route: ActivatedRoute,
    private locationSerice: LocationService,
    protected loader: NgxUiLoaderService,
    private modalService: NgbModal
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'xl',
      windowClass: 'posSettings',
      scrollable: true,
    };

    this.cols = [
      { field: 'invoiceNo', header: 'Invoice_No' },
      { field: 'orderDate', header: 'Order_Date' },
      { field: 'orderIdentity.name', header: 'Order_Identity_Name' },
      { field: 'orderType', header: 'Order_Type' },
      { field: 'paymentType', header: 'Payment_Type' },
      { field: 'status', header: 'Status' },
      { field: 'totals.total', header: 'Grand_Total' },
    ];
  }

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
  }

  ngAfterViewInit(): void {
    this.initFetchEvent();
  }

  private initFetchEvent() {
    this.subscriptions.push(
      this.events$.subscribe((event: CalendarEvent) => {
        if (
          event.action == 'fetch' &&
          event.dateRangeStart &&
          event.dateRangeEnd
        ) {
          this.startDate = event.dateRangeStart;
          this.endDate = event.dateRangeEnd;
          this.resetOrders();
          this.fetchOrders();
        }
      })
    );
  }

  nextPage() {
    this.displayIndexOffset += this.ordersPerPage;
    if (this.hasMoreRecords) {
      this.fetchOrders();
    } else {
      this.syncDisplayedRecords();
    }
  }

  get isOnLastPage() {
    const hasMorePages =
      this.hasMoreRecords ||
      this.displayIndexOffset + this.ordersPerPage < this.allRecords.length;

    return !hasMorePages;
  }

  prevPage() {
    this.displayIndexOffset -= this.ordersPerPage;
    this.syncDisplayedRecords();
  }

  syncDisplayedRecords() {
    this.displayedRecords = this.allRecords.slice(
      this.displayIndexOffset,
      this.displayIndexOffset + this.ordersPerPage
    );
  }

  fetchOrders() {
    this.loader.start();
    this.isCurrentlyRunning = true;

    this.subscriptions.push(
      this.locationSerice
        .getOrderHistory(
          this.locationId,
          this.startDate,
          this.endDate,
          this.ordersPerPage,
          this.continuationToken || undefined
        )
        .pipe(
          finalize(() => {
            this.loader.stop();
          })
        )
        .subscribe((data: OrderRecordsModel) => {
          this.allRecords = this.allRecords.concat(data.orderRecords);
          this.allRecords.forEach((record) => {
            if (
              !record.paymentDetails?.paymentIntegrationLabel &&
              record.redeemedRewards?.length > 0
            )
              record.paymentDetails = {
                paymentIntegrationLabel: 'Rewards',
              } as PaymentDetails;
          });
          this.syncDisplayedRecords();

          this.hasMoreRecords = data.moreRecords;
          this.continuationToken = data.continuationToken;
        })
    );

    this.isCurrentlyRunning = false;
  }

  open(order: OrderRecord) {
    let params = {
      order: order,
    };
    const modalRef = this.modalService.open(
      OrderItemsModalComponent,
      this.modalOptions
    );

    modalRef.componentInstance.fromParent = params;

    modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
        if (result === 'Refunded') {
          this.resetOrders();
          this.fetchOrders();
        }
      },
      (reason: any) => {
        this.closeResult = `Closed with: ${reason}`;
      }
    );
  }

  handleSearchChange(e: any) {
    const query = e.target.value.toLowerCase();
    this.displayIndexOffset = 0;
    this.displayedRecords = this.allRecords.filter((order) => {
      return (
        order.orderIdentity?.name?.toLowerCase().includes(query) ||
        order.invoiceNo.toLowerCase().includes(query) ||
        order.totals.total === Number(query)
      );
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchQuery = '';
    this.displayIndexOffset = 0;
    this.syncDisplayedRecords();
  }

  resetOrders() {
    this.displayIndexOffset = 0;
    this.displayedRecords = [];
    this.allRecords = [];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
