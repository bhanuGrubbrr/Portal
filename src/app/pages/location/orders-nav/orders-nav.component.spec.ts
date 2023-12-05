import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersNavComponent } from './orders-nav.component';

describe('OrdersNavComponent', () => {
  let component: OrdersNavComponent;
  let fixture: ComponentFixture<OrdersNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrdersNavComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
