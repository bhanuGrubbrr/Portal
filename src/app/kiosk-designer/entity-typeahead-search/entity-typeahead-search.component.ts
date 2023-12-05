import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-entity-typeahead-search',
  templateUrl: './entity-typeahead-search.component.html',
  styleUrls: ['./entity-typeahead-search.component.scss'],
})
export class EntityTypeaheadSearchComponent<T> {
  @Input() label: string;
  @Input() placeholder: string = 'Name';
  @Input() typeaheadOptions: T[];
  @Input() getSuggestionLabel: (entity: T) => string;
  @Input() getSuggestionLabelId: (entity: T) => string;
  @Input() modifierGroupId: string;
  @Output() selectOption: EventEmitter<T> = new EventEmitter();

  searchQuery = '';

  get visibleOptions() {
    const options = this.typeaheadOptions.filter(
      (x: any) =>
        (typeof x.isActive === 'undefined' || x.isActive) &&
        (this.getSuggestionLabel(x)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase()) ||
          this.getSuggestionLabelId(x)
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase()))
    );

    return options;
  }

  constructor() {}

  onClickOption(option: T) {
    this.selectOption.emit(option);
    this.searchQuery = '';
  }
}
