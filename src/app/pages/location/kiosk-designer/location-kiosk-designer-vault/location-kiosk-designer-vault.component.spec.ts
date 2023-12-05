import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerVaultComponent } from './location-kiosk-designer-vault.component';

describe('LocationKioskDesignerVaultComponent', () => {
  let component: LocationKioskDesignerVaultComponent;
  let fixture: ComponentFixture<LocationKioskDesignerVaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerVaultComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationKioskDesignerVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
