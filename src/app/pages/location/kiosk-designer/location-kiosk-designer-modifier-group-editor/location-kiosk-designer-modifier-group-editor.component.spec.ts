import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerModifierGroupEditorComponent } from './location-kiosk-designer-modifier-group-editor.component';

describe('LocationKioskDesignerModifierGroupEditorComponent', () => {
  let component: LocationKioskDesignerModifierGroupEditorComponent;
  let fixture: ComponentFixture<LocationKioskDesignerModifierGroupEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerModifierGroupEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LocationKioskDesignerModifierGroupEditorComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
