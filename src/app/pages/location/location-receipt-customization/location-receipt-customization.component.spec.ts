import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationReceiptCustomizationComponent } from './location-receipt-customization.component';

describe('LocationReceiptCustomizationComponent', () => {
  let component: LocationReceiptCustomizationComponent;
  let fixture: ComponentFixture<LocationReceiptCustomizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationReceiptCustomizationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationReceiptCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
