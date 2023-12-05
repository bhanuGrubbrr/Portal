import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PosService } from 'src/app/grubbrr/service/pos.service';

@Component({
  selector: 'app-connector-remove-modal',
  templateUrl: './connector-remove-modal.component.html',
  styleUrls: ['./connector-remove-modal.component.scss'],
})
export class ConnectorRemoveModalComponent implements OnInit {
  @Input() fromParent: any;
  public posTypeName: string;
  isTypedValid: boolean = false;
  typedPosTypeName = '';
  subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private posService: PosService
  ) {}

  ngOnInit(): void {
    this.posTypeName = this.fromParent?.connector?.displayName;
  }

  checkTypedName() {
    this.isTypedValid = this.typedPosTypeName === this.posTypeName;
  }

  remove() {
    this.subscriptions.push(
      this.posService
        .removePosIntegrationDefinition(this.fromParent.connector)
        .pipe(finalize(() => {}))
        .subscribe(() => {
          this.activeModal.close();
        })
    );
  }
}
