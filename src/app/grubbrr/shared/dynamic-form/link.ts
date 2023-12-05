import { FormFieldBase } from './formfield-base';

export class LinkField extends FormFieldBase<string> {
  override controlType = 'link';
}
