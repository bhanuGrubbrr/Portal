import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-remove',
  templateUrl: './confirm-remove.component.html',
  styleUrls: ['./confirm-remove.component.scss'],
})
export class ConfirmRemoveComponent {
  @Input() fromParent: any;

  constructor(public activeModal: NgbActiveModal) {}
}
