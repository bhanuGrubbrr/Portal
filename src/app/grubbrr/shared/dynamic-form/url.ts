import { FormFieldBase } from './formfield-base';

export class UrlField extends FormFieldBase<string> {
  override controlType = 'url';
}
