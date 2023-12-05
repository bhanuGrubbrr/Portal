import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-clmm-confirmation',
  templateUrl: './clmm-confirmation.component.html',
  styleUrls: ['./clmm-confirmation.component.scss'],
})
export class ClmmConfirmationComponent implements OnInit {
  @Input() isCLMM: boolean;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    // Do some fake work
    this.init();
  }

  init() {
    // replace with real code
  }
}
