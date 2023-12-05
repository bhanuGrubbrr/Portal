import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderTokenSettingsVM } from 'src/app/grubbrr/generated/kioskConfig_pb';

@Component({
  selector: 'app-order-token-modal',
  templateUrl: './order-token-modal.component.html',
  styleUrls: ['./order-token-modal.component.scss'],
})
export class OrderTokenModalComponent implements OnInit {
  @Input() fromParent: any;

  tokenSettings: OrderTokenSettingsVM;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.tokenSettings = this.fromParent.tokenSettings ?? {
      allotment: 100,
      orderNumberStart: 100,
    };
  }
}
