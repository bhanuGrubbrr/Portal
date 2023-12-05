import { Component, Input } from '@angular/core';
import { OrderStatusEnum } from '../../core/models/enums';

@Component({
  selector: 'app-order-status-badge',
  templateUrl: './order-status-badge.component.html',
  styleUrls: ['./order-status-badge.component.scss'],
})
export class OrderStatusBadgeComponent {
  @Input() status: string;
  @Input() numberOfRefunds: number | undefined;
  @Input() showCount = false;

  constructor() {}

  get OrderStatusEnum() {
    return OrderStatusEnum;
  }
}
