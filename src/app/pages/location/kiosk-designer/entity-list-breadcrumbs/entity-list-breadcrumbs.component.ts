import { Component, EventEmitter, Input, Output } from '@angular/core';

type BreadcrumbItem<T> = {
  id: T;
  label: string;
};

@Component({
  selector: 'app-entity-list-breadcrumbs',
  templateUrl: './entity-list-breadcrumbs.component.html',
  styleUrls: ['./entity-list-breadcrumbs.component.scss'],
})
export class EntityListBreadcrumbsComponent<T> {
  @Input() breadcrumbs: BreadcrumbItem<T>[];
  @Output() clickItem = new EventEmitter<BreadcrumbItem<T>>();

  constructor() {}

  onClickItemLink(item: BreadcrumbItem<T>) {
    this.clickItem.emit(item);
  }
}
