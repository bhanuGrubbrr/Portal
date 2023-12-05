import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerComponent } from './company-kiosk-designer.component';

describe('CompanyKioskDesignerComponent', () => {
  let component: CompanyKioskDesignerComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyKioskDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
