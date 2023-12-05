import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationStaffDeactivateComponent } from './location-staff-deactivate.component';

describe('LocationStaffDeactivateComponent', () => {
  let component: LocationStaffDeactivateComponent;
  let fixture: ComponentFixture<LocationStaffDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationStaffDeactivateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationStaffDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
