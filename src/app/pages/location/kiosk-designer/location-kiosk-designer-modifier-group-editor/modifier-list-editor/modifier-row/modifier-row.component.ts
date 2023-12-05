import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Modifier } from 'src/app/grubbrr/service/menu.service';
import { Router } from '@angular/router';
import {
  UnsavedModifier,
  isSavedModifier,
} from 'src/app/grubbrr/models/menu.models';
@Component({
  selector: 'app-modifier-row',
  templateUrl: './modifier-row.component.html',
  styleUrls: ['./modifier-row.component.scss'],
})
export class ModifierRowComponent {
  @Input() item: Modifier | UnsavedModifier;
  @Input() locationId: string;
  @Output() clickModifierName = new EventEmitter<Modifier | UnsavedModifier>();
  @Output() modifierChanged = new EventEmitter<
    [string, Modifier | UnsavedModifier]
  >();
  @Output() clickRemove = new EventEmitter<Modifier | UnsavedModifier>();

  constructor(private router: Router) {}

  changeIsDefault(isDefault: boolean) {
    this.item.isDefault = isDefault;
    this.modifierChanged.emit([this.item.menuItem.id, this.item]);
  }

  changeMaxQty(maxQty: number) {
    this.item.maxQuantity = maxQty;
    this.modifierChanged.emit([this.item.menuItem.id, this.item]);
  }

  hasNestedMods(value: Modifier | UnsavedModifier) {
    return !!value.menuItem.modifierGroupIds?.length;
  }

  getIdForModifier(value: Modifier | UnsavedModifier) {
    return isSavedModifier(value) ? value.id : undefined;
  }

  onClickRemove(modifier: Modifier | UnsavedModifier) {
    this.clickRemove.emit(modifier);
  }

  onClickName() {
    this.clickModifierName.emit(this.item);
  }

  onClickEdit(item: any) {
    this.router.navigate([
      `/location/${this.locationId}/kiosk-designer/menu/modifier/${item.menuItemId}`,
    ]);
  }

  changeIsInvisible(isInvisible: boolean) {
    this.item.isInvisible = isInvisible;
    this.modifierChanged.emit([this.item.menuItem.id, this.item]);
  }
}
