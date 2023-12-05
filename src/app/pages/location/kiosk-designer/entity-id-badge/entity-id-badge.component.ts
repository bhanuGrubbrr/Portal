import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-entity-id-badge',
  templateUrl: './entity-id-badge.component.html',
  styleUrls: ['./entity-id-badge.component.scss'],
})
export class EntityIdBadgeComponent {
  @Input() entityId: string | undefined;
}
