import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationUserEditComponent } from './location-user-edit.component';

describe('LocationUserEditComponent', () => {
  let component: LocationUserEditComponent;
  let fixture: ComponentFixture<LocationUserEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationUserEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationUserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
