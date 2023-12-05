import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-remove-integration',
  templateUrl: './remove-integration.component.html',
  styleUrls: ['./remove-integration.component.scss'],
})
export class RemoveIntegrationComponent implements OnInit {
  @Input() fromParent: any;
  name: string;
  typedName = '';
  isTypedValid: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.name = this.fromParent?.name;
    this.isTypedValid = this.name === '';
  }

  checkTypedName() {
    this.isTypedValid = this.typedName === this.name;
  }
}
