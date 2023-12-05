import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-full-refund',
  templateUrl: './confirm-full-refund.component.html',
  styleUrls: ['./confirm-full-refund.component.scss'],
})
export class ConfirmFullRefundComponent {
  @Input() invoiceNo: string;

  constructor(public activeModal: NgbActiveModal) {}

  closeModal(invoiceNo: string) {
    this.activeModal.close(invoiceNo);
  }
}
