import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerMenuComponent } from './company-kiosk-designer-menu.component';

describe('CompanyKioskDesignerMenuComponent', () => {
  let component: CompanyKioskDesignerMenuComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyKioskDesignerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
