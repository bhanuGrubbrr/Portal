import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeletePaymentSettingsComponent } from './confirm-delete-payment-settings.component';

describe('ConfirmDeletePaymentSettingsComponent', () => {
  let component: ConfirmDeletePaymentSettingsComponent;
  let fixture: ComponentFixture<ConfirmDeletePaymentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDeletePaymentSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDeletePaymentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
