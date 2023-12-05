import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDeleteUserComponent } from './location-delete-user.component';

describe('LocationDeleteUserComponent', () => {
  let component: LocationDeleteUserComponent;
  let fixture: ComponentFixture<LocationDeleteUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationDeleteUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDeleteUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
