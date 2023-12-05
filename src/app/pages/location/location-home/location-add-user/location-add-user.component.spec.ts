import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationAddUserComponent } from './location-add-user.component';

describe('LocationAddUserComponent', () => {
  let component: LocationAddUserComponent;
  let fixture: ComponentFixture<LocationAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationAddUserComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
