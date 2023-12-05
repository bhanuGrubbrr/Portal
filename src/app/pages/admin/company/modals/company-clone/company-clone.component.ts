import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-company-modal',
  templateUrl: './company-clone.component.html',
  styleUrls: ['./company-clone.component.scss'],
})
export class CompanyCloneComponent implements OnInit {
  @Input() fromParent: any;
  companyName: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.companyName = this.fromParent.companyName;
  }

  closeModal(message: string) {
    this.activeModal.close();
  }
}
