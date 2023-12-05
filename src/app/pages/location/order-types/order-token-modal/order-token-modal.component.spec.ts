import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTokenModalComponent } from './order-token-modal.component';

describe('OrderTokenModalComponent', () => {
  let component: OrderTokenModalComponent;
  let fixture: ComponentFixture<OrderTokenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderTokenModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
