import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminUserModel } from 'src/app/grubbrr/core/models/adminuser.model';

@Component({
  selector: 'app-admin-deactivate-modal',
  templateUrl: './admin-deactivate-modal.component.html',
  styleUrls: ['./admin-deactivate-modal.component.scss'],
})
export class AdminDeactivateModalComponent implements OnInit {
  @Input() fromParent: any;
  user: AdminUserModel;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.user = this.fromParent.user;
  }

  closeModal(message: string) {
    this.activeModal.close(this.user.email);
  }
}
