import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class PaginatorComponent {
  @Input() page: number;
  @Input() numberOfResults: number;
  @Input() perPage: number;
  @Output() goToPage = new EventEmitter<number>();

  get numberOfPages() {
    return Math.ceil(this.numberOfResults / this.perPage);
  }

  get clickablePages(): number[] {
    const minPage = Math.max(this.page - 5, 1);
    const maxPage = Math.min(minPage + 5, this.numberOfPages);

    let pages: number[] = [];
    for (let i = minPage; i <= maxPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  constructor() {}

  onClickPage(page: number) {
    this.goToPage.emit(page);
  }

  goToNext() {
    this.goToPage.emit(Math.min(this.page + 1, this.numberOfPages));
  }

  goToPrev() {
    this.goToPage.emit(Math.max(this.page - 1, 1));
  }
}
