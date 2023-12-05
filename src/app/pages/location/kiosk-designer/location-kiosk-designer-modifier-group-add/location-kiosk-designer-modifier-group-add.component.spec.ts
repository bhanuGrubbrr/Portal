import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerModifierGroupAddComponent } from './location-kiosk-designer-modifier-group-add.component';

describe('LocationKioskDesignerModifierGroupAddComponent', () => {
  let component: LocationKioskDesignerModifierGroupAddComponent;
  let fixture: ComponentFixture<LocationKioskDesignerModifierGroupAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerModifierGroupAddComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(
      LocationKioskDesignerModifierGroupAddComponent
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
