import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UnsavedModifier } from 'src/app/grubbrr/models/menu.models';
import {
  MenuItem,
  MenuService,
  Modifier,
  ModifierGroupWithModifiers,
} from 'src/app/grubbrr/service/menu.service';

export type ModifierListEditorValue = {
  modifiersByModifierGroup: {
    root: (Modifier | UnsavedModifier)[];
    [modifierGroupId: string]: (Modifier | UnsavedModifier)[];
  };
  editedModifiers: (Modifier | UnsavedModifier)[];
};

export const MODIFIER_EDITOR_CONTROL_COMPONENT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ModifierListEditorComponent),
  multi: true,
};

type ModifierListBreadcrumb = {
  id: keyof ModifierListEditorValue['modifiersByModifierGroup'];
  label: string;
};

@Component({
  selector: 'app-modifier-list-editor',
  templateUrl: './modifier-list-editor.component.html',
  styleUrls: ['./modifier-list-editor.component.scss'],
  providers: [MODIFIER_EDITOR_CONTROL_COMPONENT_VALUE_ACCESSOR],
})
export class ModifierListEditorComponent implements ControlValueAccessor {
  @Input() locationId: string;
  @Input() availableItems: MenuItem[];
  @Input() modifierGroupName: string;
  @Input() modifierGroupId: string;

  value: ModifierListEditorValue;
  onChange = (value: ModifierListEditorValue) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  isAdding = false;

  showModifiers = true;

  modifierGroupByItemId: { [menuItemId: string]: ModifierGroupWithModifiers } =
    {};

  displayedModifierGroupStack: ModifierGroupWithModifiers[] = [];

  constructor(private menuService: MenuService, private toast: ToastrService) {}

  updateModifier([modifierMenuItemId, updatedModifier]: [
    string,
    Modifier | UnsavedModifier
  ]) {
    const currentKey = this.getKeyForCurrentDisplayedModifierGroupId();
    this.value.modifiersByModifierGroup[currentKey] =
      this.value.modifiersByModifierGroup[currentKey].map((m) => {
        if (m.menuItem.id !== modifierMenuItemId) {
          return m;
        }
        return updatedModifier;
      });
    if (!this.value.editedModifiers) {
      this.value.editedModifiers = [];
    }
    if (
      this.value.editedModifiers.some(
        (x) => x.menuItem.id == modifierMenuItemId
      )
    ) {
      const idx = this.value.editedModifiers.findIndex(
        (x) => x.menuItem.id == modifierMenuItemId
      );
      this.value.editedModifiers[idx] = { ...updatedModifier };
    } else {
      this.value.editedModifiers.push(updatedModifier);
    }
    this.onChange(this.value);
  }

  get modifierBreadcrumbs(): ModifierListBreadcrumb[] {
    return [
      {
        id: 'root',
        label: this.modifierGroupName,
      },
    ].concat(
      this.displayedModifierGroupStack.map((group) => {
        return {
          id: group.id,
          label: group.displayName ?? group.name,
        };
      })
    );
  }

  async navigateToNestedModifier(value: Modifier | UnsavedModifier) {
    let modifierGroup: ModifierGroupWithModifiers;
    if (!this.modifierGroupByItemId[value.menuItem.id]) {
      const item = await this.menuService.getItem(
        this.locationId,
        value.menuItem.id
      );
      const firstModifierGroup = item.modifierGroups[0];
      if (!firstModifierGroup) {
        return;
      }
      const fullModifierGroup = await this.menuService.getModifierGroup(
        this.locationId,
        firstModifierGroup.id
      );
      this.modifierGroupByItemId[value.menuItem.id] = fullModifierGroup;
      modifierGroup = fullModifierGroup;
    } else {
      modifierGroup = this.modifierGroupByItemId[value.menuItem.id];
    }
    if (!this.value.modifiersByModifierGroup[modifierGroup.id]) {
      this.value.modifiersByModifierGroup[modifierGroup.id] =
        modifierGroup.modifiers;
    }
    this.displayedModifierGroupStack.push(modifierGroup);
  }

  getKeyForCurrentDisplayedModifierGroupId(): keyof ModifierListEditorValue['modifiersByModifierGroup'] {
    if (this.displayedModifierGroupStack.length === 0) {
      return 'root';
    } else {
      return this.displayedModifierGroupStack[
        this.displayedModifierGroupStack.length - 1
      ].id;
    }
  }

  get currentModifierList() {
    const currentKey = this.getKeyForCurrentDisplayedModifierGroupId();
    return this.value.modifiersByModifierGroup[currentKey];
  }

  writeValue(value: ModifierListEditorValue) {
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
    moveItemInArray(
      this.currentModifierList,
      event.previousIndex,
      event.currentIndex
    );
    this.onChange(this.value);
  }

  onClickAdd() {
    this.isAdding = true;
  }

  getSuggestionLabel(entity: MenuItem) {
    return entity.displayName ?? '';
  }

  getSuggestionLabelId(entity: MenuItem) {
    return entity.id;
  }

  onSelectOption(entity: MenuItem) {
    const currentKey = this.getKeyForCurrentDisplayedModifierGroupId();
    const modifiers = this.value.modifiersByModifierGroup[currentKey];

    if (modifiers.some((modifier) => modifier.menuItem.id === entity.id)) {
      this.toast.error(`Error: This modifier has already been added.`);
    } else {
      const newModifier: UnsavedModifier = {
        menuItem: entity,
        maxQuantity: 1,
        isInvisible: false,
        isDefault: false,
        price: entity.price,
      };

      this.value.modifiersByModifierGroup[currentKey] =
        modifiers.concat(newModifier);
      this.onChange(this.value);
    }
  }

  clickBreadcrumb(item: ModifierListBreadcrumb) {
    if (item.id === 'root') {
      this.displayedModifierGroupStack = [];
    } else {
      const indexOfItem = this.displayedModifierGroupStack.findIndex(
        (el) => el.id === item.id
      );
      this.displayedModifierGroupStack = this.displayedModifierGroupStack.slice(
        0,
        indexOfItem + 1
      );
    }
  }

  onClickRemoveModifier(entity: Modifier | UnsavedModifier) {
    const currentKey = this.getKeyForCurrentDisplayedModifierGroupId();
    this.value.modifiersByModifierGroup[currentKey] =
      this.value.modifiersByModifierGroup[currentKey].filter(
        (g) => g.menuItem.id !== entity.menuItem.id
      );
    this.onChange(this.value);
  }
}
