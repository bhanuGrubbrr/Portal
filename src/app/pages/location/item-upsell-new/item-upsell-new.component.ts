import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  ItemUpsellGroupVM,
  ItemUpsellGroupListVM,
} from 'src/app/grubbrr/generated/upsell_pb';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UpsellService } from 'src/app/grubbrr/service/upsell.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { PopupPlacement } from 'src/app/core/global-constants';

@Component({
  selector: 'app-item-upsell-new',
  templateUrl: './item-upsell-new.component.html',
  styleUrls: ['./item-upsell-new.component.scss'],
})
export class ItemUpsellNewComponent implements OnInit {
  loading: boolean = true;
  locationId: string;
  groupData: ItemUpsellGroupVM[];

  constructor(
    private route: ActivatedRoute,
    private loader: NgxUiLoaderService,
    private cdr: ChangeDetectorRef,
    private upsellService: UpsellService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    this.locationId = this.route.snapshot.params.locationid;
    await this.fetchData();
  }

  private async fetchData() {
    this.groupData = [];
    this.loader.start();
    await this.loadItemUpsellGroups();
    this.loading = false;
    this.loader.stop();
    this.cdr.detectChanges();
  }

  private async loadItemUpsellGroups() {
    let data = await this.upsellService.getItemUpsellGroups(this.locationId);
    this.groupData = data.groups;
  }

  confirm(event: Event, upsellGroup: ItemUpsellGroupVM) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Delete upsell group? '${upsellGroup.properties?.name}'`,
      acceptButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeUpsell(upsellGroup);
      },
      reject: () => {},
    });
  }

  removeUpsell(upsellGroup: ItemUpsellGroupVM) {
    this.loader.start();
    const index = this.groupData.findIndex(
      (item) => item.properties?.id === upsellGroup.properties?.id
    );

    if (index != -1) {
      this.groupData.splice(index, 1);
      this.saveUpsellGroups(
        `Removed upsell group '${upsellGroup.properties?.name}'`
      );
    } else {
      this.loader.stop();
      this.messageService.add({
        severity: 'error',
        summary: 'There was an issue removing upsell group',
        key: PopupPlacement.TopCenter,
      });
    }
  }

  drop(arr: Array<any>, event: CdkDragDrop<string[]>) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    this.saveUpsellGroups('Saved re-ordered upsell groups');
  }

  toggleUpsellStatus(upsellGroup: ItemUpsellGroupVM) {
    this.loader.start();
    const indexRow = this.groupData.findIndex(
      (item) => item.properties?.id === upsellGroup.properties?.id
    );
    if (indexRow != -1) {
      if (
        this.groupData[indexRow].properties &&
        this.groupData[indexRow].properties !== undefined
      ) {
        this.groupData[indexRow].properties!.enabled =
          !this.groupData[indexRow].properties!.enabled;
      }

      this.saveUpsellGroups(
        `Upsell Group '${upsellGroup.properties?.name}' ${
          this.groupData[indexRow].properties!.enabled ? 'Enabled' : 'Disabled'
        }`
      );
    } else {
      this.loader.stop();
      this.messageService.add({
        severity: 'error',
        summary: 'There was an issue removing upsell group',
        key: PopupPlacement.TopCenter,
      });
    }
  }

  async saveUpsellGroups(message: string) {
    this.loader.start();
    let UpsertCandidate = {} as ItemUpsellGroupListVM;
    UpsertCandidate.groups = this.groupData;
    try {
      await this.upsellService.upsertItemUpsellGroups(
        this.locationId,
        UpsertCandidate
      );
      this.messageService.add({
        severity: 'success',
        summary: message,
        key: PopupPlacement.TopCenter,
      });
    } catch {
      this.handleError('There was an issue saving upsell groups');
    } finally {
      this.loader.stop();
      this.cdr.detectChanges();
    }
  }

  private handleError(errorMessage: string) {
    this.messageService.add({
      severity: 'error',
      summary: errorMessage,
      key: PopupPlacement.TopCenter,
    });
  }
}
