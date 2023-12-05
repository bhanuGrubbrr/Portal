import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerMenuAddComponent } from './company-kiosk-designer-menu-add.component';

describe('CompanyKioskDesignerMenuAddComponent', () => {
  let component: CompanyKioskDesignerMenuAddComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerMenuAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerMenuAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyKioskDesignerMenuAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
