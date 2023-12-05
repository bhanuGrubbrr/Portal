import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-entity-row-image',
  templateUrl: './entity-row-image.component.html',
  styleUrls: ['./entity-row-image.component.scss'],
})
export class EntityRowImageComponent {
  @Input() imageUrl: string | null;
}
