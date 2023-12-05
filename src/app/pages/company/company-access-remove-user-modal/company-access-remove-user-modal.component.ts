import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RoleAssignmentVM } from 'src/app/grubbrr/generated/accessList_pb';
@Component({
  selector: 'app-company-access-remove-user-modal',
  templateUrl: './company-access-remove-user-modal.component.html',
  styleUrls: ['./company-access-remove-user-modal.component.scss'],
})
export class CompanyAccessRemoveModalComponent implements OnInit {
  @Input() fromParent: any;
  userRole: RoleAssignmentVM;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.userRole = this.fromParent;
  }
}
