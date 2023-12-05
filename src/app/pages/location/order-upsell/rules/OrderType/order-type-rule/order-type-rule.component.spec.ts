import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTypeRuleComponent } from './order-type-rule.component';

describe('OrderTypeRuleComponent', () => {
  let component: OrderTypeRuleComponent;
  let fixture: ComponentFixture<OrderTypeRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderTypeRuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTypeRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
