import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PopupPlacement } from 'src/app/core/global-constants';
import { OrderTypeOptionVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import {
  OrderUpsellGroupListVM,
  OrderUpsellGroupPropertiesVM,
  OrderUpsellGroupVM,
} from 'src/app/grubbrr/generated/upsell_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import { UpsellService } from 'src/app/grubbrr/service/upsell.service';
type SelectableOrderType = OrderTypeOptionVM & { checked?: boolean };
type SelectableUpsellGroup = OrderUpsellGroupPropertiesVM & {
  orderType?: string;
};

@Component({
  selector: 'app-order-upsell-new',
  templateUrl: './order-upsell-new.component.html',
  styleUrls: ['./order-upsell-new.component.scss'],
})
export class OrderUpsellNewComponent implements OnInit {
  loading: boolean = true;
  locationId: string;

  upsellGroups: SelectableUpsellGroup[] = [];
  public orderTypes: SelectableOrderType[];
  groupData: OrderUpsellGroupVM[];

  constructor(
    private route: ActivatedRoute,
    private upsellService: UpsellService,
    private cdr: ChangeDetectorRef,
    private kioskConfig: KioskConfigService,
    private messageService: MessageService,
    private loader: NgxUiLoaderService,
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
    this.upsellGroups = [];
    this.loader.start();

    await this.loadOrderTypes();
    await this.loadOrderUpsellGroups();

    this.loading = false;
    this.loader.stop();
    this.cdr.detectChanges();
  }

  private async loadOrderUpsellGroups() {
    const data = await this.upsellService.getOrderUpsellGroups(this.locationId);
    this.groupData = data.groups;
    this.groupData.forEach((item) => this.processUpsellGroup(item));
  }

  private processUpsellGroup(item: OrderUpsellGroupVM) {
    let orderType: string = '';
    let tests = item.conditions?.tests?.find(
      (t) => t.test.oneofKind == 'orderTypeTest'
    );
    if (tests && tests.test.oneofKind == 'orderTypeTest') {
      tests.test.orderTypeTest.orderTypes.forEach((type) => {
        let target = this.orderTypes.find((o) => o.id == type);
        if (target) {
          target.checked = true;
          orderType =
            orderType == '' ? target.label : orderType + ', ' + target.label;
        }
      });
    }

    this.upsellGroups.push({
      name: item.properties?.name!,
      id: item.properties?.id!,
      orderType: orderType,
      enabled: item.properties?.enabled ?? false,
    });
  }

  private async loadOrderTypes() {
    let res = await this.kioskConfig.getOrderTypes(this.locationId);
    if (res) {
      this.orderTypes = res.options;
    }
  }

  drop(arr: Array<any>, event: CdkDragDrop<string[]>) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
    moveItemInArray(this.groupData, event.previousIndex, event.currentIndex);

    this.saveUpsellGroups('Saved re-ordered upsell groups');
  }

  async saveUpsellGroups(message: string) {
    this.loader.start();

    let UpsertCandidate = {} as OrderUpsellGroupListVM;

    UpsertCandidate.groups = this.groupData;

    try {
      await this.upsellService.upsertOrderUpsellGroups(
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
      this.fetchData();
    }
  }

  confirm(event: Event, upsellGroup: SelectableUpsellGroup) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `Delete upsell group? '${upsellGroup.name}'`,
      acceptButtonStyleClass: 'p-button-danger',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeUpsell(upsellGroup);
      },
      reject: () => {},
    });
  }

  toggleUpsellStatus(upsellGroup: SelectableUpsellGroup) {
    this.loader.start();

    const indexRow = this.groupData.findIndex(
      (item) => item.properties?.id === upsellGroup.id
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
        `Upsell Group '${upsellGroup.name}' ${
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

  removeUpsell(upsellGroup: SelectableUpsellGroup) {
    this.loader.start();
    const index = this.groupData.findIndex(
      (item) => item.properties?.id === upsellGroup.id
    );

    if (index != -1) {
      this.groupData.splice(index, 1);
      this.saveUpsellGroups(`Removed upsell group '${upsellGroup.name}'`);
    } else {
      this.loader.stop();
      this.messageService.add({
        severity: 'error',
        summary: 'There was an issue removing upsell group',
        key: PopupPlacement.TopCenter,
      });
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
