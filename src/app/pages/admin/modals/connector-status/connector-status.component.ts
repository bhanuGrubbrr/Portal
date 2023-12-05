import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-connector-status',
  templateUrl: './connector-status.component.html',
  styleUrls: ['./connector-status.component.scss'],
})
export class ConnectorStatusComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
