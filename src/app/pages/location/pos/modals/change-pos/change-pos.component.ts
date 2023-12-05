import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-pos',
  templateUrl: './change-pos.component.html',
  styleUrls: ['./change-pos.component.scss'],
})
export class ChangePOSComponent implements OnInit {
  @Input() fromParent: any;
  posName: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.posName = this.fromParent.posName;
  }

  closeModal(message: string) {
    this.activeModal.close(message);
  }
}
