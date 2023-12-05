import { Input, Output, EventEmitter, Component, OnInit } from '@angular/core';
import { MenuCategoryWithItems } from 'src/app/grubbrr/models/menu.models';

@Component({
  selector: 'app-column-selection',
  templateUrl: './column-selection.component.html',
  styleUrls: ['./column-selection.component.scss'],
})
export class ColumnSelectionComponent implements OnInit {
  @Input() id: string;
  @Input() public category: MenuCategoryWithItems;
  @Output() selectColumn = new EventEmitter<number>();
  column: number;

  constructor() {}

  ngOnInit(): void {
    this.column = this.category.numberOfColumns;
  }

  columnChanged(event: any) {
    if (event) {
      this.column = event;
      this.selectColumn.emit(event);
    }
  }
}
