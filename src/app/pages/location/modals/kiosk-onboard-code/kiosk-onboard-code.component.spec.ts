import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskOnboardCodeComponent } from './kiosk-onboard-code.component';

describe('KioskOnboardCodeComponent', () => {
  let component: KioskOnboardCodeComponent;
  let fixture: ComponentFixture<KioskOnboardCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KioskOnboardCodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskOnboardCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
