import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerItemsComponent } from './company-kiosk-designer-items.component';

describe('CompanyKioskDesignerItemsComponent', () => {
  let component: CompanyKioskDesignerItemsComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerItemsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyKioskDesignerItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
