import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
})
export class ColorInputComponent {
  @Input() colorInput: any;
  @Input() inputName: string;
  @Input() colorPickerName: string;
  @Output() colorChangedEvent = new EventEmitter<string>();
  @Input() colorValue!: string;

  constructor() {}

  updateColorPicker($event: any) {
    this.colorValue = $event;
    this.colorChangedEvent.emit($event);
  }

  colorPickerChange($event: any) {
    this.colorValue = $event.target.value;
    this.colorChangedEvent.emit($event.target.value);
  }
}
