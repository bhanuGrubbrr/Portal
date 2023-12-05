import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-vault-step-row',
  templateUrl: './vault-step-row.component.html',
  styleUrls: ['./vault-step-row.component.scss'],
})
export class VaultStepRowComponent {
  @Input() stepCount: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() selected: boolean = true;

  constructor() {}
}
