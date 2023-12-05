import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import { Subscription } from 'rxjs';
import { FormFieldTypeModel } from 'src/app/grubbrr/core/models/formfieldtype.model';
import { PosSyncIntegrationDefinitionVM } from 'src/app/grubbrr/generated/system_pb';
import { PosService } from 'src/app/grubbrr/service/pos.service';
import { SystemService } from 'src/app/grubbrr/service/system.service';

@Component({
  selector: 'app-connector-edit-modal',
  templateUrl: './connector-edit-modal.component.html',
  styleUrls: ['./connector-edit-modal.component.scss'],
})
export class ConnectorEditModalComponent implements OnInit, AfterViewInit {
  @Input() fromParent: any;

  editor: JSONEditor;
  editorpossync: JSONEditor;
  subscriptions: Subscription[] = [];
  isEdit: boolean;
  connectorIds: string[] = [];
  errorList: string[] = [];
  errorListPosSync: string[] = [];
  connectorPrimarylst = {};
  connectorPosSynclst = {};
  posIndex: number = Tabs.PosDefination;
  cdr: any;
  constructor(
    public activeModal: NgbActiveModal,
    private posService: PosService,
    private systemService: SystemService
  ) {
    this.posIndex = 0;
    localStorage.setItem('posIndex', this.posIndex?.toString());
  }

  ngOnInit(): void {
    this.setJsonEditor();
  }

  ngAfterViewInit(): void {
    this.setJsonEditor();
  }

  navChanged(event: MatTabChangeEvent): void {
    this.posIndex = event.index;
    localStorage.setItem('posIndex', this.posIndex?.toString());
    this.setJsonEditor();
  }

  async save() {
    const curIndex = localStorage.getItem('posIndex') || 0;
    if (curIndex === '0') {
      const jsonObj = this.editor?.get();
      if (!jsonObj) return;

      const isValidPosIntDef = this.validateJsonObject(jsonObj);
      if (!isValidPosIntDef) return;

      const data = await this.posService.upsertPosIntegrationDefinition(
        jsonObj
      );
      this.handleResult(data, 'postype');
    } else if (curIndex === '1') {
      const jsonObjPosSync = this.editorpossync?.get();
      if (!jsonObjPosSync) return;

      const isValidPosSyncIntDef =
        this.validatePosSyncJsonObject(jsonObjPosSync);
      if (!isValidPosSyncIntDef) return;

      const dataResult = await this.systemService.addPosSyncType(
        this.fromParent?.connector?.id,
        jsonObjPosSync
      );
      this.handleResult(dataResult, 'posSynctype');
    }
  }

  private handleResult(data: any, closeParam: string) {
    if (data.validationErrors && data.validationErrors.length > 0) {
      this.errorList.push(data.validationErrors);
    } else {
      this.activeModal.close(data[closeParam]);
    }
  }

  validateJsonObject(jsonObj: any) {
    return this.validateJsonObj(jsonObj, this.errorList);
  }
  validatePosSyncJsonObject(jsonObj: any) {
    return this.validateSyncJsonObj(jsonObj, this.errorList);
  }

  validateSyncJsonObj(jsonObj: any, errorList: string[]): boolean {
    errorList.length = 0;
    if (
      jsonObj?.posSyncSetting &&
      !this.validateObject(jsonObj?.posSyncSetting)
    ) {
      errorList.push(`Invalid json format.`);
      return false;
    }
    if (
      jsonObj?.kioskPushSetting &&
      !this.validateObject(jsonObj?.kioskPushSetting)
    ) {
      errorList.push(`Invalid json format.`);
      return false;
    }
    return true;
  }

  validateObject(obj: any) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && typeof obj[key] !== 'boolean') {
        return false;
      }
    }
    return true;
  }

  validateJsonObj(jsonObj: any, errorList: string[]): boolean {
    errorList.length = 0;
    const posIntPrefix = 'pid-';

    if (!jsonObj.id.startsWith(posIntPrefix)) {
      errorList.push(`id must be prefixed with '${posIntPrefix}'`);
      return false;
    }

    if (jsonObj.id === posIntPrefix) {
      errorList.push(`id must follow '${posIntPrefix}NAME-OF-POS'`);
      return false;
    }

    if (
      !this.isEdit &&
      this.connectorIds.filter((a) => a === jsonObj.id).length !== 0
    ) {
      errorList.push(`id already exists, select a different id.`);
      return false;
    }

    return true;
  }

  async setJsonEditor() {
    const index = localStorage.getItem('posIndex') || 0;
    this.isEdit = this.fromParent?.connector || false;
    const connector = this.isEdit
      ? this.fromParent.connector
      : await this.getNewPosType();

    this.connectorIds = this.fromParent.connectorIds || [];
    this.connectorPrimarylst = connector;

    const posSyncRow =
      this.isEdit && this.fromParent?.syncRow !== undefined
        ? this.fromParent.syncRow
        : await this.getNewPosSyncType();
    this.connectorPosSynclst = posSyncRow;
    delete posSyncRow.id;
    if (+index === 0) {
      this.setupJSONEditor('jsoneditor', connector);
    }
    if (+index === 1) {
      this.setupJSONEditor('jsoneditorPosSync', posSyncRow);
    }
  }

  private setupJSONEditor(containerId: string, data: any) {
    this.connectorIds = this.fromParent.connectorIds;
    const container = document.getElementById(containerId);
    if (!container) return;

    const initOptions: JSONEditorOptions = {
      name: 'Connector',
      mode: 'code',
      enableSort: false,
      navigationBar: false,
      enableTransform: false,
      mainMenuBar: false,
      statusBar: false,
    };

    let editor =
      containerId === 'jsoneditor' ? this.editor : this.editorpossync;

    if (!editor) {
      editor = new JSONEditor(container, initOptions);
      if (containerId === 'jsoneditor') {
        this.editor = editor;
      } else {
        this.editorpossync = editor;
      }
    }

    editor.setMode('code');
    editor.set(data);
  }

  async getNewPosType() {
    const fields: { [key: string]: FormFieldTypeModel } = {
      fieldKey: {
        defaultValue: 'DEFUALT_VALUE',
        required: false,
        label: 'LABEL',
        type: 'Integer,Boolean,IpAddress,Password,Url,Hidden,Link',
      },
    };

    const definition: any = await this.posService.getPosIntegrationDefinition();
    definition.fields = fields;
    return definition;
  }

  async getNewPosSyncType() {
    const posSyncSetting = {
      menuItemOverrides: 'true|false',
      menuCategoryOverrides: 'true|false',
      modifierGroupOverrides: 'true|false',
      modifierOverrides: 'true|false',
    };
    const kioskPullSetting = {
      kioskPriceUpdate: 'true|false',
      kioskFullMenuUpdate: 'true|false',
      kioskNoUpdate: 'true|false',
    };

    const definition =
      (await this.systemService.getPosSyncDefinition()) as PosSyncIntegrationDefinitionVM;
    definition.posSyncSetting = JSON.parse(JSON.stringify(posSyncSetting));
    definition.kioskPushSetting = JSON.parse(JSON.stringify(kioskPullSetting));
    return definition;
  }
}

export enum Tabs {
  PosDefination = 1,
  PosSyncDefination = 2,
}
