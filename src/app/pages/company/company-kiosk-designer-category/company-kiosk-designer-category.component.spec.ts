import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerCategoryComponent } from './company-kiosk-designer-category.component';

describe('CompanyKioskDesignerCategoryComponent', () => {
  let component: CompanyKioskDesignerCategoryComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerCategoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyKioskDesignerCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
