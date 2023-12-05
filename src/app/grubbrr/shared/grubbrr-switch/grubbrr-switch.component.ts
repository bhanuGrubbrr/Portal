import { EventEmitter, Output, Component, Input } from '@angular/core';

@Component({
  selector: 'app-grubbrr-switch',
  templateUrl: './grubbrr-switch.component.html',
  styleUrls: ['./grubbrr-switch.component.scss'],
})
export class GrubbrrSwitchComponent {
  @Input() value?: boolean;
  @Input() disabled: boolean;
  @Output() switchValueChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
}
