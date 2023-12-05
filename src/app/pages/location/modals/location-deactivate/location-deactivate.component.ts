import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-location-deactivate',
  templateUrl: './location-deactivate.component.html',
  styleUrls: ['./location-deactivate.component.scss'],
})
export class LocationDeactivateComponent implements OnInit {
  @Input() fromParent: any;
  locationName: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.locationName = this.fromParent.locationName;
  }

  closeModal(message: string) {
    this.activeModal.close(message);
  }
}
