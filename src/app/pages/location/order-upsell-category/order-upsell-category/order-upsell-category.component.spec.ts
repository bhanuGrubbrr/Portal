import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpsellCategoryComponent } from './order-upsell-category.component';

describe('OrderUpsellCategoryComponent', () => {
  let component: OrderUpsellCategoryComponent;
  let fixture: ComponentFixture<OrderUpsellCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderUpsellCategoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUpsellCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
