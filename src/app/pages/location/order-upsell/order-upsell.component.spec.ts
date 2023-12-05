import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpsellComponent } from './order-upsell.component';

describe('OrderUpsellComponent', () => {
  let component: OrderUpsellComponent;
  let fixture: ComponentFixture<OrderUpsellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderUpsellComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUpsellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
