import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { forwardRef, Component, Input } from '@angular/core';
import { MenuItem } from 'src/app/grubbrr/service/menu.service';

export const ITEM_EDITOR_CONTROL_COMPONENT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ItemListEditorComponent),
  multi: true,
};

@Component({
  selector: 'app-item-list-editor',
  templateUrl: './item-list-editor.component.html',
  styleUrls: ['./item-list-editor.component.scss'],
  providers: [ITEM_EDITOR_CONTROL_COMPONENT_VALUE_ACCESSOR],
})
export class ItemListEditorComponent implements ControlValueAccessor {
  @Input() locationId: string;
  @Input() availableItems: MenuItem[];

  isAdding = false;

  value: MenuItem[];
  onChange = (value: MenuItem[]) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  constructor() {}

  onClickAdd() {
    this.isAdding = true;
  }

  onRemoveItem(item: MenuItem) {
    this.markAsTouched();
    if (!this.disabled) {
      this.value = this.value.filter((i) => i.id !== item.id);
      this.onChange(this.value);
    }
  }

  getSuggestionLabel(entity: MenuItem) {
    return entity.displayName;
  }

  getSuggestionLabelId(entity: MenuItem) {
    return entity.id;
  }

  onSelectOption(entity: MenuItem) {
    this.value = this.value.concat(entity);
    this.onChange(this.value);
  }

  writeValue(value: MenuItem[]) {
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.value, event.previousIndex, event.currentIndex);
    this.onChange(this.value);
  }
}
