import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerCategoryEditorComponent } from './location-kiosk-designer-category-editor.component';

describe('LocationKioskDesignerCategoryEditorComponent', () => {
  let component: LocationKioskDesignerCategoryEditorComponent;
  let fixture: ComponentFixture<LocationKioskDesignerCategoryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerCategoryEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LocationKioskDesignerCategoryEditorComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
