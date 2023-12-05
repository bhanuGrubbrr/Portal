import { FormFieldBase } from './formfield-base';

export class TextboxField extends FormFieldBase<string> {
  override controlType = 'textbox';
}
export class NumericTextboxField extends FormFieldBase<string> {
  override controlType = 'numbertextbox';
}
