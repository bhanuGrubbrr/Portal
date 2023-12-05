import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { forwardRef, Component, Input } from '@angular/core';
import { ModifierGroup } from 'src/app/grubbrr/service/menu.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
export const MODIFIER_GROUP_EDITOR_CONTROL_COMPONENT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ModifierGroupListEditorComponent),
  multi: true,
};

@Component({
  selector: 'app-modifier-group-list-editor',
  templateUrl: './modifier-group-list-editor.component.html',
  styleUrls: ['./modifier-group-list-editor.component.scss'],
  providers: [MODIFIER_GROUP_EDITOR_CONTROL_COMPONENT_VALUE_ACCESSOR],
})
export class ModifierGroupListEditorComponent implements ControlValueAccessor {
  @Input() locationId: string;
  @Input() availableItems: ModifierGroup[];
  @Input() page = 1;
  @Input() perPage = 20;

  isAdding = false;

  value: ModifierGroup[];
  onChange = (value: ModifierGroup[]) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  modifierGroupPlaceholder = 'Add Modifier Group';

  constructor(private toast: ToastrService, private router: Router) {}

  goToPage(page: number) {
    this.page = page;
  }

  get displayedItems() {
    return this.value.slice(
      this.perPage * (this.page - 1),
      this.perPage * this.page
    );
  }

  onClickAdd() {
    this.isAdding = true;
  }

  onRemoveModifierGroup(groupToRemove: ModifierGroup) {
    this.value = this.value.filter((g) => g.id !== groupToRemove.id);
    this.onChange(this.value);
  }

  getSuggestionLabel(entity: ModifierGroup) {
    let label = entity.name;
    label += entity.displayName ? ` - (${entity.displayName})` : '';
    return label;
  }

  getSuggestionLabelId(entity: ModifierGroup) {
    return entity.id;
  }

  onSelectOption(entity: ModifierGroup) {
    this.value = this.value.concat(entity);
    this.onChange(this.value);
  }

  writeValue(value: ModifierGroup[]) {
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

  onClickRemoveAll() {
    this.value = [];
    this.onChange(this.value);
  }

  onClickEdit(id: any) {
    this.router.navigate([
      `/location/${this.locationId}/kiosk-designer/menu/modifier-group/edit/${id}`,
    ]);
  }
}
