import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-more-show-less-button',
  templateUrl: './show-more-show-less-button.component.html',
  styleUrls: ['./show-more-show-less-button.component.scss'],
})
export default class ShowMoreShowLessButtonComponent<T> {
  @Input() items: T[];
  @Output() itemsToShowChanges: EventEmitter<number> =
    new EventEmitter<number>();
  itemsToShow: number = 10;

  constructor() {}

  get count() {
    return this.items?.length ?? 0;
  }

  onShowMoreClick() {
    this.itemsToShow += 10;
    this.itemsToShowChanges.emit(this.itemsToShow);
  }

  onShowLessClick() {
    this.itemsToShow = Math.max(10, this.itemsToShow - 10);
    this.itemsToShowChanges.emit(this.itemsToShow);
  }

  getDisplayedItems(): T[] {
    return this.items.slice(0, this.itemsToShow);
  }
}
