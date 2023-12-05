import { Component, Input } from '@angular/core';

type VaultEntity = {
  name: string;
  id: string;
  price?: number;
};

@Component({
  selector: 'app-vault-entity-selector',
  templateUrl: './vault-entity-selector.component.html',
  styleUrls: ['./vault-entity-selector.component.scss'],
})
export class VaultEntitySelectorComponent<
  T extends VaultEntity,
  C extends VaultEntity
> {
  @Input() entity: T;
  @Input() children: C[];
  expanded = false;

  constructor() {}

  toggleExpanded() {
    this.expanded = !this.expanded;
  }
}
