import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-add-entity-button',
  templateUrl: './add-entity-button.component.html',
  styleUrls: ['./add-entity-button.component.scss'],
})
export class AddEntityButtonComponent {
  @Input() label: string;
  @Output() clickAddButton: EventEmitter<void> = new EventEmitter();

  onClick() {
    this.clickAddButton.emit();
  }
}
