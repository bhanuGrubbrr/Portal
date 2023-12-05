import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UpsellItem } from 'src/app/grubbrr/core/models/upsell.model';
import {
  ItemUpsellGroupVM,
  ItemUpsellMappingVM,
} from 'src/app/grubbrr/generated/upsell_pb';
type SelectableItem = UpsellItem & { triggered?: boolean };

@Component({
  selector: 'app-item-upsell-group',
  templateUrl: './item-upsell-group.component.html',
  styleUrls: ['./item-upsell-group.component.scss'],
})
export class ItemUpsellGroupComponent implements OnInit {
  @Input() type: string;
  @Input() upsellID: string;
  @Input() currentGroup: ItemUpsellGroupVM;
  @Input() menuItems: SelectableItem[];
  @Input() otherItems: SelectableItem[];

  @Output() selectOffer: EventEmitter<[SelectableItem, boolean, string]> =
    new EventEmitter();

  locationId: string;
  buttonText: string;
  isAdd = false;
  isCategoryTypeaheadVisible = false;

  offers: SelectableItem[] = [];
  filteredUpsell: SelectableItem[] = [];
  filteredTrigger: SelectableItem[] = [];

  constructor(private route: ActivatedRoute, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;
    this.buttonText = 'Add Item';
    this.fetchData();
  }

  private async fetchData() {
    this.loadGroupOffers();
  }

  private async loadGroupOffers() {
    this.offers = [];
    if (this.type == 'Trigger Item') {
      this.currentGroup.mapping.forEach((offer) => {
        switch (offer.id.oneofKind) {
          case 'menuItemId':
            let item = this.menuItems.find(this.finder(offer.id.menuItemId));
            if (item) this.offers.push(item);
            break;
        }
      });
    } else {
      this.currentGroup.offers.forEach((offer) => {
        switch (offer.id.oneofKind) {
          case 'menuItemId':
            let item = this.menuItems.find(this.finder(offer.id.menuItemId));
            if (item) this.offers.push(item);
            break;
        }
      });
    }

    this.updateSelectable();
  }

  finder = (id: string) => (offer: UpsellItem) => offer.object.id === id;

  private updateSelectable() {
    if (this.type == 'Trigger Item') {
      this.filteredTrigger = this.menuItems.filter(
        (a) =>
          !this.offers.find(this.finder(a.object.id)) &&
          !a.triggered &&
          !this.otherItems.find(this.finder(a.object.id))
      );
    } else {
      this.filteredUpsell = this.menuItems.filter(
        (a) =>
          !this.offers.find(this.finder(a.object.id)) &&
          !this.otherItems.find(this.finder(a.object.id))
      );
    }
    this.cdr.detectChanges();
  }

  drop(arr: Array<any>, event: CdkDragDrop<string[]>) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
  }

  RemoveOffer(index: number) {
    this.isAdd = false;
    this.selectOffer.emit([this.offers[index], this.isAdd, this.type]);
    this.offers.splice(index, 1);
    this.updateSelectable();
  }

  showCategoryAdder() {
    this.isCategoryTypeaheadVisible = true;
  }

  async onSelectOption(offer: UpsellItem) {
    this.isAdd = true;
    this.offers.push(offer);
    this.isCategoryTypeaheadVisible = false;

    this.selectOffer.emit([offer, this.isAdd, this.type]);
    this.updateSelectable();
  }
  getSuggestionLabelId(category: UpsellItem) {
    return category.object.id;
  }

  getSuggestionLabel(category: UpsellItem) {
    return category.object.name;
  }

  get availableCategoriesToAdd() {
    if (this.type == 'Trigger Item') {
      this.filteredTrigger = this.menuItems.filter(
        (a) =>
          !this.offers.find(this.finder(a.object.id)) &&
          !a.triggered &&
          !this.otherItems.find(this.finder(a.object.id))
      );
      return this.filteredTrigger;
    } else {
      this.filteredUpsell = this.menuItems.filter(
        (a) =>
          !this.offers.find(this.finder(a.object.id)) &&
          !this.otherItems.find(this.finder(a.object.id))
      );
      return this.filteredUpsell;
    }
  }
}
