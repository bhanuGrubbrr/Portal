import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupPaymentTypeComponent } from './setup-payment-type.component';

describe('SetupPaymentTypeComponent', () => {
  let component: SetupPaymentTypeComponent;
  let fixture: ComponentFixture<SetupPaymentTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetupPaymentTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetupPaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
