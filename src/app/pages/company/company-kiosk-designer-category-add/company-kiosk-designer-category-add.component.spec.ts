import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerCategoryAddComponent } from './company-kiosk-designer-category-add.component';

describe('CompanyKioskDesignerCategoryAddComponent', () => {
  let component: CompanyKioskDesignerCategoryAddComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerCategoryAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerCategoryAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyKioskDesignerCategoryAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
