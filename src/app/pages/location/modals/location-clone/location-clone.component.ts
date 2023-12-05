import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-location-clone',
  templateUrl: './location-clone.component.html',
  styleUrls: ['./location-clone.component.scss'],
})
export class LocationCloneComponent implements OnInit {
  @Input() fromParent: any;
  locationName: string;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.locationName = this.fromParent.locationName;
  }

  closeModal(message: string) {
    this.activeModal.close();
  }
}
