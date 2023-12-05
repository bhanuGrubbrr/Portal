import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationInheritanceBannerComponent } from './location-inheritance-banner.component';

describe('LocationInheritanceBannerComponent', () => {
  let component: LocationInheritanceBannerComponent;
  let fixture: ComponentFixture<LocationInheritanceBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationInheritanceBannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationInheritanceBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
