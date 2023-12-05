import { FormFieldBase } from './formfield-base';

export class HiddenTextboxField extends FormFieldBase<string> {
  override controlType = 'hidden';
}
