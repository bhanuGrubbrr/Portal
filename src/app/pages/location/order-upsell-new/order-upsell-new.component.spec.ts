import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderUpsellNewComponent } from './order-upsell-new.component';

describe('OrderUpsellNewComponent', () => {
  let component: OrderUpsellNewComponent;
  let fixture: ComponentFixture<OrderUpsellNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderUpsellNewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderUpsellNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
