import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NameIdSettingsVM } from 'src/app/grubbrr/generated/kioskConfig_pb';

@Component({
  selector: 'app-cust-id-advanced-options-modal',
  templateUrl: './cust-id-advanced-options-modal.component.html',
  styleUrls: ['./cust-id-advanced-options-modal.component.scss'],
})
export class CustIdAdvancedOptionsModalComponent implements OnInit {
  @Input() fromParent: any;

  nameSettings: NameIdSettingsVM;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.nameSettings = Object.assign(
      {},
      this.fromParent.nameSettings ?? {
        askBeforeOrder: false,
      }
    );
  }

  close(save: boolean) {
    if (save) {
      this.activeModal.close(this.nameSettings);
    } else {
      this.activeModal.close(
        this.fromParent.nameSettings ?? { askBeforeOrder: false }
      );
    }
  }
}
