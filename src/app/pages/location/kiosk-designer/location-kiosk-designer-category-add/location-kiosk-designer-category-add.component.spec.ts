import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerCategoryAddComponent } from './location-kiosk-designer-category-add.component';

describe('LocationKioskDesignerCategoryAddComponent', () => {
  let component: LocationKioskDesignerCategoryAddComponent;
  let fixture: ComponentFixture<LocationKioskDesignerCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerCategoryAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LocationKioskDesignerCategoryAddComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
