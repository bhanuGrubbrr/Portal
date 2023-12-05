import { FormFieldBase } from './formfield-base';

export class PasswordField extends FormFieldBase<string> {
  override controlType = 'password';
}
