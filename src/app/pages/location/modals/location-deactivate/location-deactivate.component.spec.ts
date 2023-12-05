import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDeactivateComponent } from './location-deactivate.component';

describe('LocationDeactivateComponent', () => {
  let component: LocationDeactivateComponent;
  let fixture: ComponentFixture<LocationDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationDeactivateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
