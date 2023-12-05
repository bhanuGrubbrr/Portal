import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmFullRefundComponent } from './confirm-full-refund.component';

describe('ConfirmFullRefundComponent', () => {
  let component: ConfirmFullRefundComponent;
  let fixture: ComponentFixture<ConfirmFullRefundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmFullRefundComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmFullRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
