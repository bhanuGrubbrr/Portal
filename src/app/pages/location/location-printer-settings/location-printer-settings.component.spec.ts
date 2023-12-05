import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPrinterSettingsComponent } from './location-printer-settings.component';

describe('LocationPrinterSettingsComponent', () => {
  let component: LocationPrinterSettingsComponent;
  let fixture: ComponentFixture<LocationPrinterSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationPrinterSettingsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPrinterSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
