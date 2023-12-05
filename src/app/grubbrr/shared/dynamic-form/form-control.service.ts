import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormFieldTypeModel } from '../../core/models/formfieldtype.model';
import { LinkField } from './link';
import { CheckboxField } from './checkbox';
import { FieldType } from './FieldType';
import { FormFieldBase } from './formfield-base';
import { HiddenTextboxField } from './hidden';
import { PasswordField } from './password';
import { NumericTextboxField, TextboxField } from './textbox';
import { UrlField } from './url';
import { FormFieldTypeVM } from '../../generated/common_pb';
import { DropdownField } from './dropdown';

@Injectable({ providedIn: 'root' })
export class FormControlService {
  constructor() {}

  toFormGroup(fields: FormFieldBase<string>[]) {
    const group: any = {};
    fields.forEach((field) => {
      group[field.key] = this.getFormControl(field);
    });
    return new FormGroup(group);
  }

  createFormField(
    formField: FormFieldTypeVM,
    key: string,
    order: number
  ): TextboxField {
    var model = new FormFieldTypeModel(
      formField.formFieldValueType,
      formField.label,
      formField.required,
      formField.defaultValue
    );
    model.minLength = formField.minLength;
    model.maxLength = formField.maxLength;
    model.minValue = formField.minValue;
    model.maxValue = formField.maxValue;

    return this.getNewField(model, key, order);
  }

  getNewField(
    setting: FormFieldTypeModel,
    key: string,
    order: number
  ): TextboxField {
    let fieldType2: number = 2;
    if (setting?.type) {
      fieldType2 = setting.type as FieldType;
    }

    const fieldType: FieldType = Number(FieldType[fieldType2]);
    const urlRegex =
      /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    Validators.pattern(urlRegex);

    if (fieldType == FieldType.Link) {
      return new LinkField({
        key: key,
        label: setting.label,
        value: setting?.defaultValue ?? '',
      });
    }

    if (fieldType == FieldType.Hidden) {
      return new HiddenTextboxField({
        key: key,
        label: setting.label,
        value: setting?.value ?? '',
        order: order,
      });
    }

    if (fieldType == FieldType.Url) {
      return new UrlField({
        key: key,
        label: setting.label,
        value: setting?.value ?? '',
        minLength: setting?.minLength ?? null,
        maxLength: setting?.maxLength ?? null,
        required: setting.required,
        order: order,
        pattern: urlRegex || '',
        additionalErrorMessage: 'Invalid Url',
      });
    }

    if (fieldType == FieldType.Option) {
      return new DropdownField({
        key: key,
        label: setting.label,
        value: setting?.value ?? '',
        defaultValue: setting?.defaultValue ?? null,
        minLength: setting?.minLength ?? null,
        maxLength: setting?.maxLength ?? null,
        required: setting.required,
        order: order,
        options: setting?.value ?? [],
      });
    }

    if (fieldType == FieldType.Password) {
      return new PasswordField({
        key: key,
        label: setting.label,
        value: setting?.value ?? '',
        minLength: setting?.minLength ?? null,
        maxLength: setting?.maxLength ?? null,
        required: setting.required,
        order: order,
      });
    }

    if (fieldType == FieldType.Boolean) {
      const cb = new CheckboxField({
        key: key,
        label: setting.label,
        value: setting?.value ?? false,
        minLength: setting?.minLength ?? null,
        maxLength: setting?.maxLength ?? null,
        required: setting.required,
        defaultValue: setting?.defaultValue ?? null,
        order: order,
      });
      return cb;
    }

    if (fieldType == FieldType.Integer) {
      return new NumericTextboxField({
        key: key,
        label: setting.label,
        value: setting?.value ?? null,
        minLength: setting?.minLength ?? null,
        maxLength: setting?.maxLength ?? null,
        required: setting.required,
        defaultValue: setting?.defaultValue ?? null,
        order: order,
      });
    }

    return new TextboxField({
      key: key,
      label: setting.label,
      value: setting?.value ?? '',
      defaultValue: setting?.defaultValue ?? null,
      minLength: setting?.minLength ?? null,
      maxLength: setting?.maxLength ?? null,
      required: setting.required,
      order: order,
    });
  }

  getFormControl(field: FormFieldBase<string>): AbstractControl {
    if (field.required && field.pattern) {
      return new FormControl(
        field.value || null,
        Validators.compose([
          Validators.required,
          Validators.pattern(field.pattern),
        ])
      );
    } else if (field.required) {
      return new FormControl(
        field.value || '',
        Validators.compose([Validators.required])
      );
    } else if (field.controlType === 'numbertextbox') {
      return new FormControl(field.defaultValue || field.value);
    } else if (field.controlType === 'checkbox') {
      const value = (field?.defaultValue || field?.value) === 'true';
      return new FormControl(value);
    } else {
      return new FormControl(field.value || '');
    }
  }
}
