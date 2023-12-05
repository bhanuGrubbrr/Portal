import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-entity-badge',
  templateUrl: './entity-badge.component.html',
  styleUrls: ['./entity-badge.component.scss'],
})
export class EntityBadgeComponent {
  @Input() label: string;
  @Output() remove: EventEmitter<void> = new EventEmitter();

  onClickRemove() {
    this.remove.emit();
  }
}
