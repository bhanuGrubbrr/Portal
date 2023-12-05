import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationUsersComponent } from './location-users.component';

describe('LocationUsersComponent', () => {
  let component: LocationUsersComponent;
  let fixture: ComponentFixture<LocationUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationUsersComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
