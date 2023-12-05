import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemUpsellNewComponent } from './item-upsell-new.component';

describe('ItemUpsellNewComponent', () => {
  let component: ItemUpsellNewComponent;
  let fixture: ComponentFixture<ItemUpsellNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemUpsellNewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemUpsellNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
