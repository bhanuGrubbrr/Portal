import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerItemsEditComponent } from './company-kiosk-designer-items-edit.component';

describe('CompanyKioskDesignerItemsEditComponent', () => {
  let component: CompanyKioskDesignerItemsEditComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerItemsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerItemsEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyKioskDesignerItemsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
