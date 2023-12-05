import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NoChangesMessage } from 'src/app/core/global-constants';
import {
  CategoryChange,
  SyncRecord,
} from 'src/app/grubbrr/core/models/menusync.model';

@Component({
  selector: 'app-menu-sync-detail-modal',
  templateUrl: './menu-sync-detail-modal.component.html',
  styleUrls: ['./menu-sync-detail-modal.component.scss'],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[style.overflow]': '"auto"',
  },
})
export class MenuSyncDetailModalComponent implements OnInit {
  @Input() fromParent: any;
  syncRecord: SyncRecord;
  allItemPropertyChanges: CategoryChange[] = [];
  recordStatus: string = '';
  duration: number;
  noChangesMessage = NoChangesMessage;
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.syncRecord = this.fromParent.syncRecord;
    this.mapChanges();
  }

  private mapChanges() {
    this.allItemPropertyChanges = this.syncRecord.menuChanges?.addedMenuItems
      ?.map((i) => {
        i.type = 'Item added';
        return i;
      })
      .concat(
        this.syncRecord.menuChanges?.updatedMenuItems?.map((i) => {
          i.type = 'Item updated';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.removedMenuItems?.map((i) => {
          i.type = 'Item removed';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.addedCategories?.map((i) => {
          i.type = 'Category added';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.updatedCategories?.map((i) => {
          i.type = 'Category updated';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.removedCategories?.map((i) => {
          i.type = 'Category removed';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.addedModifiers?.map((i) => {
          i.type = 'Modifier added';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.updatedModifiers?.map((i) => {
          i.type = 'Modifier updated';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.removedModifiers?.map((i) => {
          i.type = 'Modifier removed';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.addedModifierGroups?.map((i) => {
          i.type = 'Modifier group added';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.updatedModifierGroups?.map((i) => {
          i.type = 'Modifier group updated';
          return i;
        })
      )
      .concat(
        this.syncRecord.menuChanges?.removedModifierGroups?.map((i) => {
          i.type = 'Modifier group removed';
          return i;
        })
      );

    this.duration =
      new Date(this.syncRecord.endTime).valueOf() -
      new Date(this.syncRecord.startTime).valueOf();

    if (this.syncRecord.status.toLowerCase() === 'exception') {
      this.recordStatus = 'error';
    } else if (this.syncRecord.menuChanges.isFullImport) {
      this.recordStatus = 'fullmenu';
    } else {
      this.recordStatus = 'hasRecords';
    }
  }

  closeModal(message: string) {
    this.activeModal.close();
  }

  trackById = (_: number, item: CategoryChange) => item.id;

  get itemItemPropertyChanges(): CategoryChange[] {
    return this.allItemPropertyChanges;
  }
}
