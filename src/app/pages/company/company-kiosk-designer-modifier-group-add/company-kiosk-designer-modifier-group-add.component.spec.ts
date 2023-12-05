import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyKioskDesignerModifierGroupAddComponent } from './company-kiosk-designer-modifier-group-add.component';

describe('CompanyKioskDesignerModifierGroupAddComponent', () => {
  let component: CompanyKioskDesignerModifierGroupAddComponent;
  let fixture: ComponentFixture<CompanyKioskDesignerModifierGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyKioskDesignerModifierGroupAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      CompanyKioskDesignerModifierGroupAddComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
