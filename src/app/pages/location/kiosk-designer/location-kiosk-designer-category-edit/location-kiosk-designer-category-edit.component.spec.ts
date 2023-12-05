import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerCategoryEditComponent } from './location-kiosk-designer-category-edit.component';

describe('LocationKioskDesignerCategoryEditComponent', () => {
  let component: LocationKioskDesignerCategoryEditComponent;
  let fixture: ComponentFixture<LocationKioskDesignerCategoryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerCategoryEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LocationKioskDesignerCategoryEditComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
