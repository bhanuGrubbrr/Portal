import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerModifierGroupEditComponent } from './location-kiosk-designer-modifier-group-edit.component';

describe('LocationKioskDesignerModifierGroupEditComponent', () => {
  let component: LocationKioskDesignerModifierGroupEditComponent;
  let fixture: ComponentFixture<LocationKioskDesignerModifierGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerModifierGroupEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LocationKioskDesignerModifierGroupEditComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
