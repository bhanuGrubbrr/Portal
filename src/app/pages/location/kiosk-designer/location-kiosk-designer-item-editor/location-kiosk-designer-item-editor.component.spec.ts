import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerItemEditorComponent } from './location-kiosk-designer-item-editor.component';

describe('LocationKioskDesignerItemEditorComponent', () => {
  let component: LocationKioskDesignerItemEditorComponent;
  let fixture: ComponentFixture<LocationKioskDesignerItemEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerItemEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationKioskDesignerItemEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
