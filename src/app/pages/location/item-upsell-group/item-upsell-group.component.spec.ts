import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUpsellGroupComponent } from './item-upsell-group.component';

describe('ItemUpsellGroupComponent', () => {
  let component: ItemUpsellGroupComponent;
  let fixture: ComponentFixture<ItemUpsellGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemUpsellGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUpsellGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
