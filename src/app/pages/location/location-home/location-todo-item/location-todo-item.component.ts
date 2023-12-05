import { Component, Input } from '@angular/core';
import {
  SetupStatusEnum,
  StatusCheckVM,
} from 'src/app/grubbrr/generated/locations_pb';

@Component({
  selector: 'app-todo-item',
  templateUrl: './location-todo-item.component.html',
  styleUrls: ['./location-todo-item.component.scss'],
})
export class LocationToDoItemComponent {
  constructor() {}

  @Input() StatusCheck: StatusCheckVM;
  @Input() SetupUrl: string;
  @Input() Label: string;

  statusClass(status: StatusCheckVM | undefined): string {
    if (status?.status == SetupStatusEnum.Green) return 'bg-success';
    if (status?.status == SetupStatusEnum.Yellow) return 'bg-warning';
    if (status?.status == SetupStatusEnum.Red) return 'bg-danger';
    else return '';
  }

  showMessage(status: StatusCheckVM | undefined): boolean {
    return status?.status !== SetupStatusEnum.Green;
  }

  statusMessage(status: StatusCheckVM | undefined): string {
    if (status?.status == SetupStatusEnum.Green) return '';
    return status?.message ?? 'status unknown';
  }

  statusIcon(status: StatusCheckVM | undefined): string {
    if (status?.status == SetupStatusEnum.Green)
      return 'fa-check-circle text-success';
    if (status?.status == SetupStatusEnum.Yellow)
      return 'fa-clipboard-list text-warning';
    if (status?.status == SetupStatusEnum.Red)
      return 'fa-clipboard-list text-danger';
    return '';
  }
}
