import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPrinterAddComponent } from './location-printer-add.component';

describe('LocationPrinterAddComponent', () => {
  let component: LocationPrinterAddComponent;
  let fixture: ComponentFixture<LocationPrinterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationPrinterAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPrinterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
