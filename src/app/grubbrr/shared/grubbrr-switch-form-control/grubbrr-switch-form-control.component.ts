import { forwardRef, Component } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export const SWITCH_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GrubbrrSwitchFormControlComponent),
  multi: true,
};

@Component({
  selector: 'app-grubbrr-switch-form-control',
  templateUrl: './grubbrr-switch-form-control.component.html',
  styleUrls: ['./grubbrr-switch-form-control.component.scss'],
  providers: [SWITCH_VALUE_ACCESSOR],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class GrubbrrSwitchFormControlComponent implements ControlValueAccessor {
  value: boolean;
  onChange = (value: boolean) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  writeValue(value: boolean) {
    this.value = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
