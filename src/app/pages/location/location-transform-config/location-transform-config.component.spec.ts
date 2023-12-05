import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationTransformConfigComponent } from './location-transform-config.component';

describe('LocationTransformConfigComponent', () => {
  let component: LocationTransformConfigComponent;
  let fixture: ComponentFixture<LocationTransformConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationTransformConfigComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTransformConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
