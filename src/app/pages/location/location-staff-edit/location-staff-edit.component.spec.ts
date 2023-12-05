import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationStaffEditComponent } from './location-staff-edit.component';

describe('LocationStaffEditComponent', () => {
  let component: LocationStaffEditComponent;
  let fixture: ComponentFixture<LocationStaffEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationStaffEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationStaffEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
