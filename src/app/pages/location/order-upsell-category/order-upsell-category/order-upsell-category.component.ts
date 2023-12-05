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
import {
  UpsellItem,
  UpsellSection,
} from 'src/app/grubbrr/core/models/upsell.model';
import { OrderUpsellGroupVM } from 'src/app/grubbrr/generated/upsell_pb';
import { MenuService } from 'src/app/grubbrr/service/menu.service';
type UpsellOffer = UpsellSection | UpsellItem;

@Component({
  selector: 'app-order-upsell-category',
  templateUrl: './order-upsell-category.component.html',
  styleUrls: ['./order-upsell-category.component.scss'],
})
export class OrderUpsellCategoryComponent implements OnInit {
  @Input() type: string;
  @Input() upsellID: string;
  @Input() currentGroup: OrderUpsellGroupVM;
  @Input() menuItems: UpsellOffer[];
  @Input() menuSections: UpsellOffer[];

  @Output() selectOffer: EventEmitter<[UpsellOffer, boolean]> =
    new EventEmitter();

  buttonText: string;
  locationId: string;

  // menuSections: UpsellOffer[] = [];
  // menuItems: UpsellOffer[] = [];
  filteredMenuSections: UpsellOffer[] = [];
  filteredMenuItems: UpsellOffer[] = [];

  offers: UpsellOffer[] = [];

  isCategoryTypeaheadVisible = false;
  isAdd = false;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.locationId = this.route.snapshot.params.locationid;

    if (this.type == 'Category') {
      this.buttonText = 'Add Category';
    } else {
      this.buttonText = 'Add Item';
    }
    this.fetchData();
  }

  private async fetchData() {
    console.log('xxxxxxxxxx: ', this.currentGroup);
    this.loadGroupOffers();
  }

  finder = (id: string) => (offer: UpsellOffer) => offer.object.id === id;

  showCategoryAdder() {
    this.isCategoryTypeaheadVisible = true;
  }

  private async loadGroupOffers() {
    this.offers = [];
    this.currentGroup.offers.forEach((offer) => {
      switch (offer.id.oneofKind) {
        case 'menuItemId':
          if (this.type != 'Category') {
            let item = this.menuItems.find(this.finder(offer.id.menuItemId));
            if (item) this.offers.push(item);
          }
          break;
        case 'categoryId':
          if (this.type == 'Category') {
            let cat = this.menuSections.find(this.finder(offer.id.categoryId));
            if (cat) this.offers.push(cat);
          }
          break;
      }
    });

    this.updateSelectable();
  }

  private updateSelectable() {
    this.filteredMenuSections = this.menuSections.filter(
      (a) => !this.offers.find(this.finder(a.object.id))
    );

    this.filteredMenuItems = this.menuItems.filter(
      (a) => !this.offers.find(this.finder(a.object.id))
    );

    this.cdr.detectChanges();
  }
  async onSelectOption(offer: UpsellOffer) {
    this.isAdd = true;
    this.offers.push(offer);
    this.isCategoryTypeaheadVisible = false;

    this.selectOffer.emit([offer, this.isAdd]);
    this.updateSelectable();
  }
  getSuggestionLabelId(category: UpsellOffer) {
    return category.object.id;
  }

  getSuggestionLabel(category: UpsellOffer) {
    return category.object.name;
  }

  get availableCategoriesToAdd() {
    if (this.type != 'Category') {
      return this.filteredMenuItems;
    }
    return this.filteredMenuSections;
  }

  RemoveOffer(index: number) {
    this.isAdd = false;
    this.selectOffer.emit([this.offers[index], this.isAdd]);
    this.offers.splice(index, 1);
    this.updateSelectable();
  }

  drop(arr: Array<any>, event: CdkDragDrop<string[]>) {
    moveItemInArray(arr, event.previousIndex, event.currentIndex);
  }
}
