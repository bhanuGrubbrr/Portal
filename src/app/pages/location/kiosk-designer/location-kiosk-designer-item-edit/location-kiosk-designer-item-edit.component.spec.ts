import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationKioskDesignerItemEditComponent } from './location-kiosk-designer-item-edit.component';

describe('LocationKioskDesignerItemEditComponent', () => {
  let component: LocationKioskDesignerItemEditComponent;
  let fixture: ComponentFixture<LocationKioskDesignerItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationKioskDesignerItemEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationKioskDesignerItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
