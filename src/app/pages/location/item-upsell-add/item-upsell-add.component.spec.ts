import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUpsellAddComponent } from './item-upsell-add.component';

describe('ItemUpsellAddComponent', () => {
  let component: ItemUpsellAddComponent;
  let fixture: ComponentFixture<ItemUpsellAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemUpsellAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUpsellAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
