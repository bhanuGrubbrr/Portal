import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const RADIO_SELECTOR_CONTROL_COMPONENT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => EntityMultiSelectComponent),
  multi: true,
};

@Component({
  selector: 'app-entity-multi-select',
  templateUrl: './entity-multi-select.component.html',
  styleUrls: ['./entity-multi-select.component.scss'],
  providers: [RADIO_SELECTOR_CONTROL_COMPONENT_VALUE_ACCESSOR],
})
export class EntityMultiSelectComponent<EntityType>
  implements ControlValueAccessor
{
  @Input() label: string;
  @Input() placeholder: string = 'Name';
  @Input() availableItems: EntityType[];
  @Input() getName: (entity: EntityType) => string;
  @Input() getSuggestionLabel: (entity: EntityType) => string;
  @Input() getSuggestionLabelId: (entity: EntityType) => string;

  value: EntityType[];
  onChange = (value: EntityType[]) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  constructor() {}

  onRemoveItem(item: EntityType) {
    this.markAsTouched();
    if (!this.disabled) {
      this.value = this.value.filter(
        (i) => this.getName(i) !== this.getName(item)
      );
      this.onChange(this.value);
    }
  }

  onSelectOption(item: EntityType) {
    this.markAsTouched();
    if (!this.disabled) {
      const newValue = this.value.concat(item);
      this.value = newValue;
      this.onChange(newValue);
    }
  }

  writeValue(value: EntityType[]) {
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
