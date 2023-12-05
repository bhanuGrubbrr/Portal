import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { FormFieldTypeModel } from 'src/app/grubbrr/core/models/formfieldtype.model';
import {
  KioskPushMetaSettingVM,
  PosSyncIntegrationDefinitionVM,
  PosSyncMetaSettingVM,
} from 'src/app/grubbrr/generated/system_pb';
import { PosService } from 'src/app/grubbrr/service/pos.service';
import { SystemService } from 'src/app/grubbrr/service/system.service';

@Component({
  selector: 'app-sync-pos-modal',
  templateUrl: './sync-pos-modal.component.html',
  styleUrls: ['./sync-pos-modal.component.scss'],
})
export class SyncPosModalComponent implements OnInit {
  @Input() fromParent: any;

  isEdit: boolean;
  posIndex: number = Tabs.PosSyncDefination;
  posSyncRow: PosSyncIntegrationDefinitionVM;
  posSyncSetting: PosSyncMetaSettingVM;
  kioskPushSetting: KioskPushMetaSettingVM;

  constructor(
    public activeModal: NgbActiveModal,
    private loader: NgxUiLoaderService,
    private systemService: SystemService
  ) {
    this.posIndex = 0;
    localStorage.setItem('posIndex', this.posIndex?.toString());
  }

  ngOnInit(): void {
    this.setJsonEditor();
  }

  navChanged(event: MatTabChangeEvent): void {
    this.posIndex = event.index;
    localStorage.setItem('posIndex', this.posIndex?.toString());
  }

  async save() {
    const pid = this.fromParent?.connector?.id;

    this.posSyncRow.posSyncSetting = this.posSyncSetting;
    this.posSyncRow.kioskPushSetting = this.kioskPushSetting;

    const dataResult = await this.systemService.addPosSyncType(
      pid,
      this.posSyncRow
    );
    this.handleResult(dataResult, 'posSynctype');
  }

  toggleStatus(event: any, type: string) {
    switch (type) {
      case 'Item':
        this.posSyncSetting.menuItemOverrides = event.target.checked;
        break;
      case 'Category':
        this.posSyncSetting.menuCategoryOverrides = event.target.checked;
        break;
      case 'ModifierGroup':
        this.posSyncSetting.modifierGroupOverrides = event.target.checked;
        break;
      case 'Modifier':
        this.posSyncSetting.modifierOverrides = event.target.checked;
        break;
      case 'Price':
        this.kioskPushSetting.kioskPriceUpdate = event.target.checked;
        this.kioskPushSetting.kioskNoUpdate = false;
        this.kioskPushSetting.kioskFullMenuUpdate = false;
        break;
      case 'FullMenu':
        this.kioskPushSetting.kioskFullMenuUpdate = event.target.checked;
        this.kioskPushSetting.kioskNoUpdate = false;
        this.kioskPushSetting.kioskPriceUpdate = false;
        break;
      case 'NoUpdate':
        this.kioskPushSetting.kioskNoUpdate = event.target.checked;
        this.kioskPushSetting.kioskFullMenuUpdate = false;
        this.kioskPushSetting.kioskPriceUpdate = false;
        break;
    }
  }
  private handleResult(data: any, closeParam: string) {
    this.activeModal.close(data[closeParam]);
  }

  async setJsonEditor() {
    this.loader.start();
    const index = localStorage.getItem('posIndex') || 0;
    this.isEdit = this.fromParent?.connector || false;

    this.posSyncRow =
      this.isEdit && this.fromParent?.syncRow !== undefined
        ? this.getRowData()
        : await this.getNewPosSyncType();
    this.loader.stop();
  }

  getRowData() {
    this.posSyncRow = this.fromParent.syncRow;
    this.posSyncSetting = {
      menuItemOverrides:
        this.posSyncRow.posSyncSetting?.menuItemOverrides ?? true,
      menuCategoryOverrides:
        this.posSyncRow.posSyncSetting?.menuCategoryOverrides ?? true,
      modifierGroupOverrides:
        this.posSyncRow.posSyncSetting?.modifierGroupOverrides ?? true,
      modifierOverrides:
        this.posSyncRow.posSyncSetting?.modifierOverrides ?? true,
    };
    this.kioskPushSetting = {
      kioskPriceUpdate:
        this.posSyncRow.kioskPushSetting?.kioskPriceUpdate ?? true,
      kioskFullMenuUpdate:
        this.posSyncRow.kioskPushSetting?.kioskFullMenuUpdate ?? false,
      kioskNoUpdate: this.posSyncRow.kioskPushSetting?.kioskNoUpdate ?? false,
    };
    return this.posSyncRow;
  }

  async getNewPosSyncType() {
    this.posSyncSetting = {
      menuItemOverrides: true,
      menuCategoryOverrides: true,
      modifierGroupOverrides: true,
      modifierOverrides: true,
    };
    this.kioskPushSetting = {
      kioskPriceUpdate: true,
      kioskFullMenuUpdate: false,
      kioskNoUpdate: false,
    };

    const definition =
      (await this.systemService.getPosSyncDefinition()) as PosSyncIntegrationDefinitionVM;
    definition.posSyncSetting = this.posSyncSetting;
    definition.kioskPushSetting = this.kioskPushSetting;
    return definition;
  }
}

export enum Tabs {
  PosSyncDefination = 1,
  kioskPushDefination = 2,
}
