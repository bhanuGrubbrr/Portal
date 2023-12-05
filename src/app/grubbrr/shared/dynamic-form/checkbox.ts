import { FormFieldBase } from './formfield-base';

export class CheckboxField extends FormFieldBase<string> {
  override controlType = 'checkbox';
}
