import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';

export interface ValidateIntegrationProp {
  integrationObject: string;
  errorList: string[];
}

@Component({
  selector: 'app-edit-integration',
  templateUrl: './edit-integration.component.html',
  styleUrls: ['./edit-integration.component.scss'],
})
export class EditIntegrationComponent implements OnInit {
  @Input() fromParent: any;

  editor: JSONEditor;
  isEdit: boolean;
  errorList: string[] = [];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.setJsonEditor();
  }

  async save() {
    const json = this.editor?.get();
    if (!json) return;

    if (this.fromParent.validateJson) {
      this.fromParent.validateJson({
        integrationObject: json,
        errorList: this.errorList,
      });
      if (this.errorList.length > 0) return;
    }

    this.activeModal.close(json);
  }

  async setJsonEditor() {
    this.isEdit = this.fromParent?.integrationObject !== undefined;
    const defaultObject = this.fromParent.defaultObject;
    const jsonObj = this.isEdit
      ? this.fromParent.integrationObject
      : defaultObject;
    const container = document.getElementById('jsoneditor');
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

    if (!this.editor) this.editor = new JSONEditor(container, initOptions);

    this.editor.setMode('code');
    this.editor.set(jsonObj);
  }
}
