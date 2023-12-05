import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerModifierEditorComponent } from './location-kiosk-designer-modifier-editor.component';

describe('LocationKioskDesignerModifierEditorComponent', () => {
  let component: LocationKioskDesignerModifierEditorComponent;
  let fixture: ComponentFixture<LocationKioskDesignerModifierEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerModifierEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LocationKioskDesignerModifierEditorComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
