import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerModifierEditComponent } from './location-kiosk-designer-modifier-edit.component';

describe('LocationKioskDesignerModifierEditComponent', () => {
  let component: LocationKioskDesignerModifierEditComponent;
  let fixture: ComponentFixture<LocationKioskDesignerModifierEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerModifierEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LocationKioskDesignerModifierEditComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
