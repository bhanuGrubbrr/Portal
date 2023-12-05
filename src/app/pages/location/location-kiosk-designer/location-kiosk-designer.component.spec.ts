import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerComponent } from './location-kiosk-designer.component';

describe('LocationKioskDesignerComponent', () => {
  let component: LocationKioskDesignerComponent;
  let fixture: ComponentFixture<LocationKioskDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationKioskDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
