import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { firstValueFrom } from 'rxjs';
import { OrderStatusEnum } from 'src/app/grubbrr/core/models/enums';
import {
  OrderRecord,
  OrderItem,
  OrderItemOption,
} from 'src/app/grubbrr/core/models/orderrecords.model';
import { PaymentService } from 'src/app/grubbrr/service/payment.service';
import { ConfirmFullRefundComponent } from '../confirm-full-refund/confirm-full-refund.component';
import { OrderService } from 'src/app/grubbrr/service/orderService.service';

@Component({
  selector: 'app-order-items-modal',
  templateUrl: './order-items-modal.component.html',
  styleUrls: ['./order-items-modal.component.scss'],
})
export class OrderItemsModalComponent implements OnInit, AfterViewInit {
  @Input() fromParent: any;
  order: OrderRecord;
  ready: boolean = false;
  disableRefundByItem = true;
  disablePartialRefund = true;
  disableFullRefund = true;
  showAdjustments = false;
  paymentType: string;

  // TODO: The refund actions are currently being removed until they can be fully
  // implemented. The UI components are removed but the logic is here and can be re-evaluated
  // when that feature is worked on
  @ViewChildren('checkboxes') checkboxes: QueryList<ElementRef>;
  @ViewChild('selectAll') selectAll: ElementRef;
  @ViewChild('refundAmount') refundAmount: ElementRef;
  modalOptions: NgbModalOptions;

  constructor(
    public activeModal: NgbActiveModal,
    private paymentservice: PaymentService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private loader: NgxUiLoaderService,
    private modalService: NgbModal,
    private orderService: OrderService
  ) {
    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: false,
      size: 'lg',
      scrollable: true,
      backdropClass: 'top-modal',
      windowClass: 'top-modal',
    };
  }

  ngOnInit(): void {
    this.order = this.fromParent.order;
    this.paymentType =
      this.order.paymentTransactionDeatils?.length > 1
        ? 'Mixed'
        : this.order.paymentDetails.paymentIntegrationLabel;
    this.initButtonActions();
  }

  ngAfterViewInit(): void {
    if (this.order.status !== OrderStatusEnum.FullRefund) {
      // disble checkboxes if we need to for any items already refunded
      this.checkboxes.forEach((element) => {
        const item = this.order.refunds.filter((r) =>
          r.itemIds?.includes(element.nativeElement.value)
        )[0];

        if (item) {
          element.nativeElement.disabled = true;
        }
      });
    }
  }

  private initButtonActions() {
    const orderFullyRefunded = this.order?.adjustedTotal === 0;

    // If we have any refunds already, we will not allow full refunds
    this.disableFullRefund = this.order.status !== OrderStatusEnum.Paid;
    // We can do partial refunds by amount or item only if we don't have full refund
    this.disableRefundByItem =
      this.order.status === OrderStatusEnum.FullRefund || orderFullyRefunded;
    this.disablePartialRefund = this.disableRefundByItem;

    this.showAdjustments = this.order?.adjustedTotal !== null ? true : false;

    this.ready = true;
    this.cdr.detectChanges();
  }

  async partialRefund() {
    const refundAmount = this.refundAmount.nativeElement.value;

    if (refundAmount === '') {
      this.toastr.warning('Please enter amount to refund');
      this.loader.stop();
      return;
    }

    this.loader.start();

    const response = await firstValueFrom(
      this.paymentservice.partialRefundOrderByAmount(
        this.order.locationId,
        this.order.invoiceNo,
        refundAmount
      )
    )
      .catch((err) => {
        this.toastr.error('Refund failed on Order');
      })
      .finally(() => this.loader.stop());

    if (response) {
      this.closeModal('Refunded');
      this.toastr.success('Refund Processed');
    }

    this.loader.stop();
  }

  async refundByItem() {
    let refundedItems = Array<string>();
    this.checkboxes.forEach((element) => {
      if (element.nativeElement.checked) {
        refundedItems.push(element.nativeElement.value);
      }
    });

    if (refundedItems.length === 0) {
      this.toastr.warning('Please select at least one item to refund');
      this.loader.stop();
      return;
    }

    this.loader.start();

    const response = await firstValueFrom(
      this.paymentservice.partialRefundOrderByItems(
        this.order.locationId,
        this.order.invoiceNo,
        refundedItems
      )
    )
      .catch((err) => {
        this.toastr.error('Refund failed on Order');
      })
      .finally(() => this.loader.stop());

    if (response) {
      this.closeModal('Refunded');
      this.toastr.success('Refund Processed');
    }

    this.loader.stop();
  }

  async fullRefund() {
    var doRefund = await this.confirmFullRefund(this.order.invoiceNo);
    if (doRefund === false) {
      this.loader.stop();
      return;
    }

    const response = await firstValueFrom(
      this.paymentservice.refundOrder(
        this.order.locationId,
        this.order.invoiceNo
      )
    )
      .catch((err) => {
        this.toastr.error('Refund failed on Order');
      })
      .finally(() => this.loader.stop());

    if (response) {
      this.closeModal('Refunded');
      this.toastr.success('Order Fully Refunded');
    }
  }

  async confirmFullRefund(invoiceNo: string): Promise<boolean> {
    this.loader.start();
    var doRefund = false;

    const modalRef = this.modalService.open(
      ConfirmFullRefundComponent,
      this.modalOptions
    );

    modalRef.componentInstance.invoiceNo = invoiceNo;
    await modalRef.result.then((processRefund: boolean) => {
      doRefund = processRefund;
      return processRefund;
    });

    return doRefund;
  }

  toggleCheckboxes() {
    this.checkboxes.forEach((element) => {
      if (!element.nativeElement.disabled) {
        element.nativeElement.checked = this.selectAll.nativeElement.checked;
      }
    });
  }

  closeModal(message: string) {
    this.activeModal.close(message);
  }

  filterPricedModifiers(orderOptions: OrderItemOption[]) {
    return orderOptions.filter((o) => o.price > 0);
  }

  filterZeroPriceModifiers(orderOptions: OrderItemOption[]) {
    return orderOptions.filter((o) => o.price === 0);
  }

  modifierTotals(orderRecord: OrderItem) {
    const sum = orderRecord.options
      .filter((option) => option.freeQuantity < 1)
      .reduce<number>((a, o) => {
        return a + o.price * o.quantity;
      }, 0);

    return orderRecord.unitPrice + sum;
  }
  async viewReceipt() {
    let a = await this.orderService.getReceiptImage(
      this.order.invoiceNo,
      this.order.locationId
    );

    window.open(a.url, '_blank');
  }
}
