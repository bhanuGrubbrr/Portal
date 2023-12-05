import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox-card',
  templateUrl: './checkbox-card.component.html',
  styleUrls: ['./checkbox-card.component.scss'],
})
export class CheckboxCardComponent {
  @Input() selected: boolean;
  @Input() label: string;
  @Output() toggle: EventEmitter<void> = new EventEmitter();
}
