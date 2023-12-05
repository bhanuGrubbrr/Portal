import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-delete-payment-settings',
  templateUrl: './confirm-delete-payment-settings.component.html',
  styleUrls: ['./confirm-delete-payment-settings.component.scss'],
})
export class ConfirmDeletePaymentSettingsComponent implements OnInit {
  paymentIntegrationId: string;
  paymentIntegrationName: string;
  @Input() fromParent: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.paymentIntegrationId = this.fromParent.paymentIntegrationId;
    this.paymentIntegrationName = this.fromParent.paymentIntegrationName;
  }

  closeModal(paymentIntegrationId: string) {
    this.activeModal.close(paymentIntegrationId);
  }
}
