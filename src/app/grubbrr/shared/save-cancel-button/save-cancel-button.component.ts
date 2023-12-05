import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-save-cancel-button',
  templateUrl: './save-cancel-button.component.html',
  styleUrls: ['./save-cancel-button.component.scss'],
})
export class SaveCancelButtonComponent {
  @Input() saving: boolean = false;
  @Input() showCancelButton: boolean = true;
  @Input() formDisabled: boolean = false;
  @Input() backURL: string = '';
  @Output() saveButtonClickedEvent = new EventEmitter();

  constructor(public navigation: NavigationService) {}

  onSubmit() {
    this.saveButtonClickedEvent.emit();
  }
}
