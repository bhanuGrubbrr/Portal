import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerModifierGroupComponent } from './company-kiosk-designer-modifier-group.component';

describe('CompanyKioskDesignerModifierGroupComponent', () => {
  let component: CompanyKioskDesignerModifierGroupComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerModifierGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerModifierGroupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      CompanyKioskDesignerModifierGroupComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
