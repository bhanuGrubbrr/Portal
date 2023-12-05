import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-preset-tip',
  templateUrl: './delete-preset-tip.component.html',
  styleUrls: ['./delete-preset-tip.component.scss'],
})
export class DeletePresetTipComponent implements OnInit {
  @Input() fromParent: any;
  index: number;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.index = this.fromParent.index;
  }

  closeModal(index: number) {
    this.activeModal.close(index);
  }
}
