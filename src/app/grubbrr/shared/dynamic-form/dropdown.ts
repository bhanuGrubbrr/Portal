import { FormFieldBase } from './formfield-base';

export class DropdownField extends FormFieldBase<string> {
  override controlType = 'dropdown';
}
