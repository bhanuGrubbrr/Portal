import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpsellAddComponent } from './order-upsell-add.component';

describe('OrderUpsellAddComponent', () => {
  let component: OrderUpsellAddComponent;
  let fixture: ComponentFixture<OrderUpsellAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderUpsellAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUpsellAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
