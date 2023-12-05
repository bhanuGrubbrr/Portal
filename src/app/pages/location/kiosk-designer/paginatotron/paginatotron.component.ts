import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-paginatotron',
  templateUrl: './paginatotron.component.html',
  styleUrls: ['./paginatotron.component.scss'],
})
export class PaginatotronComponent<ItemType> implements OnInit, OnChanges {
  /** @param index share state of selected page, can be passed or two-way-bound */
  @Input() index: number;
  /** @param items  input item aray to be paginated and returned to parent*/
  @Input() items: ItemType[];
  /** @param pageSize maximum number of results each page should contain */
  @Input() pageSize: number;
  /** @param numVisiblePages maximum number of clickable page links to render */
  @Input() numVisiblePages: number = 5;
  /** @param indexChange function called in Paginatotron component, only affects parent if param index is two-way-bound*/
  @Output() indexChange: EventEmitter<number> = new EventEmitter<number>();
  /** @param pageOfItemsEvent returned single-page of items.
   * Should be bound to function in parent whose sole purpose is accepting an array variable,
   * setting it, and conditionally calling `CDR.detectChanges()` if needed
   *
   * (manual change detection may be needed depending on type of data passed, or other keying methods used)
   * */
  @Output() pageOfItemsEvent = new EventEmitter<ItemType[]>();

  maxPages: number = 5;
  pageOfItems: ItemType[] = [];
  clickablePages: number[] = [];
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    //ignore first change as first change is simple assignment
    if (changes.index && !changes.index.firstChange) {
      let newIndex = changes.index.currentValue;
      this.handleIndexChange(newIndex);
      this.setClickablePages(newIndex);
    }
    if (changes.items) {
      let newItems = changes.items.currentValue;
      //ensure maxPages is always set to 1 so clickable page elements will render when no items are passed
      this.maxPages =
        newItems.length === 0 ? 1 : Math.ceil(newItems.length / this.pageSize);

      this.setPageOfItems(
        newItems.slice(
          this.index * this.pageSize,
          (this.index + 1) * this.pageSize
        )
      );
      this.setClickablePages(this.index);
    }
  }
  /**
   * @description creates and assigns array of indices that can be set directly; if `currentIndex` can be centered, will center on this index.
   * Otherwise, will aligned to start or end, as appropriate.
   * @param currentIndex the active index on which to center the clickable elements .
   * @param numberOfIndices the size of the array to be returned, defaults to numVisiblePages as passed from parent;
   * Will be overridden by maxPages if maxPages is smaller
   * */
  setClickablePages(
    currentIndex: number,
    numberOfIndices: number = this.numVisiblePages
  ) {
    let startingPage: number;
    if (currentIndex + Math.ceil(numberOfIndices / 2) >= this.maxPages) {
      //prevents creating indexes out of range
      startingPage = this.maxPages - numberOfIndices;
    } else if (currentIndex > Math.floor(numberOfIndices / 2)) {
      //handles centering index
      if (numberOfIndices % 2 === 0) {
        //two center elements exist; sets currentIndex to the left of the two
        startingPage = currentIndex - (Math.floor(numberOfIndices / 2) - 1);
      } else {
        //only one center;
        startingPage = currentIndex - Math.floor(numberOfIndices / 2);
      }
    } else {
      startingPage = Math.min(this.maxPages - this.numVisiblePages, 0);
    }
    let newClickablePages = Array(Math.min(this.numVisiblePages, this.maxPages))
      .fill(0)
      .map(
        (el, i) =>
          startingPage +
          i +
          //handles negative indices if maxPages is less than numberOfIndices
          (this.maxPages < this.numVisiblePages
            ? this.numVisiblePages - this.maxPages
            : 0)
      );
    this.clickablePages = newClickablePages;
  }
  handleIndexChange(newIndex: number) {
    let newPage = this.items.slice(
      newIndex * this.pageSize,
      (newIndex + 1) * this.pageSize
    );
    this.setPageOfItems(newPage);
  }

  setIndex(newIndex: number) {
    this.indexChange.emit(newIndex);
  }
  setPageOfItems(x: ItemType[]) {
    this.pageOfItems = x;
    this.pageOfItemsEvent.emit(this.pageOfItems);
  }
  ngOnInit(): void {
    this.setPageOfItems(
      this.items.slice(
        this.index * this.pageSize,
        (this.index + 1) * this.pageSize
      )
    );
    this.maxPages =
      this.items.length === 0
        ? 1
        : Math.ceil(this.items.length / this.pageSize);
  }
  pageUp() {
    if (this.index + 1 === this.maxPages) return;
    this.setIndex(Math.min(this.index + 1, this.maxPages));
  }
  pageDown() {
    if (this.index === 0) return;
    this.setIndex(Math.max(this.index - 1, 0));
  }
  setPage(x: number) {
    this.setIndex(x);
  }
}
