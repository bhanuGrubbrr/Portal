import {
  EventEmitter,
  Component,
  Input,
  Output,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

type RadioSelectorControlOption<T> = {
  label: string;
  value: T;
};

export const RADIO_SELECTOR_CONTROL_COMPONENT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RadioSelectorControlComponent),
  multi: true,
};

@Component({
  selector: 'app-radio-selector-control',
  templateUrl: './radio-selector-control.component.html',
  styleUrls: ['./radio-selector-control.component.scss'],
  providers: [RADIO_SELECTOR_CONTROL_COMPONENT_VALUE_ACCESSOR],
})
export class RadioSelectorControlComponent<T> implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: RadioSelectorControlOption<T>[];

  value: T;
  onChange = (value: T) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  constructor() {}

  onSelect(option: RadioSelectorControlOption<T>) {
    this.markAsTouched();
    if (!this.disabled) {
      this.value = option.value;
      this.onChange(this.value);
    }
  }

  writeValue(value: T) {
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
