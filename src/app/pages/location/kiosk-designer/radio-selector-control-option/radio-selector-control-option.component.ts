import { EventEmitter, Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-radio-selector-control-option',
  templateUrl: './radio-selector-control-option.component.html',
  styleUrls: ['./radio-selector-control-option.component.scss'],
})
export class RadioSelectorControlOptionComponent {
  @Input() radioInputName: string;
  @Input() selected: boolean;
  @Input() label: string;
  @Output() selectOption: EventEmitter<void> = new EventEmitter();

  constructor() {}

  onSelect() {
    this.selectOption.emit();
  }
}
