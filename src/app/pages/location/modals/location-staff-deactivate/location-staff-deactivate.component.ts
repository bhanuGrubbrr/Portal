import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location-staff-deactivate',
  templateUrl: './location-staff-deactivate.component.html',
  styleUrls: ['./location-staff-deactivate.component.scss'],
})
export class LocationStaffDeactivateComponent implements OnInit {
  @Input() fromParent: any;
  staffName: string;
  staffId: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.staffName = this.fromParent.staffName;
    this.staffId = this.fromParent.staffId;
  }

  closeModal(message: string) {
    this.activeModal.close(message);
  }
}
