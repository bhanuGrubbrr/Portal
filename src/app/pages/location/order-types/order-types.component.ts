import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EditableRow } from 'src/app/grubbrr/core/models/editableRow';
import {
  CustomerIdentityMode,
  OrderIdentityMode,
} from 'src/app/grubbrr/core/models/enums';
import {
  NameIdSettingsVM,
  OrderTokenSettingsVM,
  OrderTypeOptionVM,
  PosOrderTypeVM,
} from 'src/app/grubbrr/generated/kioskConfig_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import { ConfirmRemoveComponent } from '../modals/confirm-remove/confirm-remove.component';
import { CustIdAdvancedOptionsModalComponent } from './cust-id-advanced-options-modal/cust-id-advanced-options-modal.component';
import { OrderTokenModalComponent } from './order-token-modal/order-token-modal.component';

@Component({
  selector: 'app-order-types',
  templateUrl: './order-types.component.html',
  styleUrls: ['./order-types.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class OrderTypesComponent implements OnInit {
  orderTokenSettings: OrderTokenSettingsVM;
  posOrderTypes: PosOrderTypeVM[] = [];

  orderIdOptions: { id: string; label: string }[] = [
    { id: OrderIdentityMode.none.toString(), label: 'None' },
    { id: OrderIdentityMode.tableTent.toString(), label: 'Table Tent' },
  ];
  customerIdOptions: { id: string; label: string }[] = [
    { id: CustomerIdentityMode.none.toString(), label: 'None' },
    { id: CustomerIdentityMode.name.toString(), label: 'Name' },
  ];
  allIdentityOptions = [...this.orderIdOptions, ...this.customerIdOptions];

  orderTypes: EditableRow<OrderTypeOptionVM>[] = [];
  locationId: string;
  modalOptions: NgbModalOptions;
  loaded: boolean;
  _copyOfEditingRow: OrderTypeOptionVM;
  isEditMode: boolean = false;
  enableEditMode: boolean = false;
  multiOrderType: boolean = false;
  isLastOrderType: () => boolean;

  constructor(
    private route: ActivatedRoute,
    private loader: NgxUiLoaderService,
    private kioskConfigService: KioskConfigService,
    private modalService: NgbModal,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.initPage();
  }

  private async initPage() {
    this.loader.start();
    this.loaded = false;

    this.locationId = this.route.snapshot.params.locationid;
    await this.fetchTokenAndTypes();

    this.modalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
      centered: true,
      scrollable: true,
    };

    this.loaded = true;
    this.loader.stopAll();
  }

  async fetchTokenAndTypes() {
    this.orderTokenSettings = await this.kioskConfigService.getOrderToken(
      this.locationId
    );

    const orderTypesResult = await this.kioskConfigService.getOrderTypes(
      this.locationId
    );
    this.orderTypes = orderTypesResult.options.map((o) => {
      return {
        isEditing: false,
        id: o.id,
        model: o,
      };
    });

    this.posOrderTypes = orderTypesResult.posOrderTypes;
  }

  showEdit(row: EditableRow<OrderTypeOptionVM>): boolean {
    const isRowEditing = this.orderTypes.some((r) => r.isEditing);
    return row.isEditing || (!this.isEditMode && !isRowEditing);
  }

  isNameValid = true;
  validateRow(row: EditableRow<OrderTypeOptionVM>): boolean {
    this.isNameValid =
      !this.orderTypes.some(
        (o) => o.id != row.id && o.model.label === row.model.label
      ) && row.model.label !== '';
    return this.isNameValid;
  }

  async saveOrderToken() {
    this.loader.start();
    this.orderTokenSettings = await this.kioskConfigService.upsertOrderToken(
      this.locationId,
      this.orderTokenSettings
    );
    this.loader.stop();
  }

  async saveOrderTypes() {
    this.loader.start();

    const options = this.orderTypes.map((o) => {
      if (o.model.orderIdentity) {
        o.model.orderIdentity.customerIdentityMode = Number(
          o.model.orderIdentity.customerIdentityMode
        );
        o.model.orderIdentity.orderIdentityMode = Number(
          o.model.orderIdentity?.orderIdentityMode
        );
      }
      return o.model;
    });

    const updated = await this.kioskConfigService.upsertOrderTypes(
      this.locationId,
      options
    );

    this.orderTypes = updated.options.map((o) => {
      return {
        isEditing: false,
        id: o.id,
        model: o,
      };
    });

    this.posOrderTypes = updated.posOrderTypes;

    this.loader.stop();
    this.loader.stopAll();
  }

  getLabel(
    value: number | undefined,
    isOrderIdentity: boolean = false
  ): string {
    if (value === undefined) return '';
    const list = isOrderIdentity ? this.orderIdOptions : this.customerIdOptions;
    return list.filter((o) => o.id === value.toString())[0]?.label ?? '';
  }

  async openTokenOptions() {
    const modalRef = this.modalService.open(
      OrderTokenModalComponent,
      this.modalOptions
    );

    modalRef.componentInstance.fromParent = {
      tokenSettings: this.orderTokenSettings,
    };

    modalRef.result.then(async (isSave: boolean) => {
      if (isSave) await this.saveOrderToken();
    });
  }

  async openNameOptions(row: EditableRow<OrderTypeOptionVM>) {
    const settings = row.model.orderIdentity?.nameSettings;
    const modalRef = this.modalService.open(
      CustIdAdvancedOptionsModalComponent,
      this.modalOptions
    );
    modalRef.componentInstance.fromParent = {
      nameSettings: row.model.orderIdentity?.nameSettings,
    };
    let result: NameIdSettingsVM = await modalRef.result;
    if (result && row.model.orderIdentity) {
      row.model.orderIdentity.nameSettings = result;
    }
  }

  async toggleEdit(
    row: EditableRow<OrderTypeOptionVM>,
    isCancel: boolean = false
  ) {
    this.multiOrderType = this.orderTypes.length > 1;

    this.isEditMode = !this.isEditMode;
    this.orderTypes.forEach((o) => {
      if (o.isEditing && o.id !== row.id) o.isEditing = false;
    });

    const isSave = this.orderTypes.some((r) => r.isEditing);
    let editRow = this.orderTypes.filter((o) => o.id === row.id)[0];

    editRow.isEditing = !editRow.isEditing;

    if (editRow.isEditing && !isCancel)
      this._copyOfEditingRow = JSON.parse(JSON.stringify(editRow.model));

    if (isCancel) editRow.model = this._copyOfEditingRow;

    if (isSave && !isCancel) await this.saveOrderTypes();

    this.isLastOrderType = () => this.orderTypes.length === 1;
  }
  async removeOrderType(row: EditableRow<OrderTypeOptionVM>) {
    if (
      this.orderTypes.length > 1 &&
      this.orderTypes.filter((i) => i.model.enabled && i.id != row.id).length >
        0
    ) {
      const modalOptions: NgbModalOptions = {
        ariaLabelledBy: 'modal-basic-title',
        backdrop: 'static',
        size: 'lg',
      };

      const modalRef = this.modalService.open(
        ConfirmRemoveComponent,
        modalOptions
      );

      modalRef.result.then(async (isConfirmed: boolean) => {
        if (!isConfirmed) return;

        this.orderTypes = this.orderTypes.filter((i) => i.id != row.id);
        await this.saveOrderTypes();
        this.isEditMode = false;
      });
    } else {
      this.toast.error('Error: There must be at least one enabled order type.');
    }

    const modalOptions: NgbModalOptions = {
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      size: 'lg',
    };

    const modalRef = this.modalService.open(
      ConfirmRemoveComponent,
      modalOptions
    );

    modalRef.result.then(async (isConfirmed: boolean) => {
      if (!isConfirmed) {
        return;
      }

      const indexToRemove = this.orderTypes.findIndex(
        (type) => type.id === row.id
      );
      const typeToRemove = this.orderTypes[indexToRemove];

      if (typeToRemove.model.enabled) {
        const lastEnabledType = this.orderTypes
          .filter((type) => type.model.enabled)
          .pop();

        if (lastEnabledType && lastEnabledType.id === row.id) {
          this.toast.error('Error: The last order type must be enabled.');
          return;
        }
      }

      this.orderTypes.splice(indexToRemove, 1);
      await this.saveOrderTypes();
      this.isEditMode = false;
    });
  }

  isLastEnabled(ordType: EditableRow<OrderTypeOptionVM>): boolean {
    return (
      this.orderTypes.filter((o) => o.model.enabled && o.id !== ordType.id)
        .length === 0
    );
  }

  getPosOrderTypeFormattedLabel(row: OrderTypeOptionVM) {
    const posType = this.posOrderTypes.filter(
      (p) => p.id == row.externalDeliveryMode
    )[0];

    return posType !== undefined ? posType.label : '';
  }

  async addNewOrderType() {
    const newLabelText = 'New Order Type';
    const newLabelCount = this.orderTypes.filter((o) =>
      o.model.label.includes(newLabelText)
    ).length;
    const newLabel =
      newLabelCount === 0 ? newLabelText : `${newLabelText} ${newLabelCount}`;

    const model: OrderTypeOptionVM = {
      id: '',
      label: newLabel,
      enabled: true,
      externalDeliveryMode: '',
      orderIdentity: {
        orderIdentityMode: OrderIdentityMode.none,
        customerIdentityMode: CustomerIdentityMode.none,
        nameSettings: undefined,
        orderIdPrefix: '',
      },
    };

    const rowVM = {
      isEditing: false, //toggle edit takes care of flipping this
      id: model.id,
      model: model,
    };

    this.orderTypes.push(rowVM);
    await this.saveOrderTypes();
    if (this.orderTypes.length > 0) {
      this.isEditMode = false;
      this.toggleEdit(this.orderTypes[this.orderTypes.length - 1]);
    }
  }
}
