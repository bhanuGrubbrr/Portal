import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-entity-list-remove-button',
  templateUrl: './entity-list-remove-button.component.html',
  styleUrls: ['./entity-list-remove-button.component.scss'],
})
export class EntityListRemoveButtonComponent {
  @Input() disabled: boolean = false;
  @Output() clickRemove = new EventEmitter();
  @Input() title: string = 'Remove';

  constructor() {}

  onClick() {
    this.clickRemove.emit();
  }
}
