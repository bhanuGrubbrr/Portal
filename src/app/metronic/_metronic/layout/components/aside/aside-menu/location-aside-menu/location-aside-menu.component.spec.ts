import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationAsideMenuComponent } from './location-aside-menu.component';

describe('LocationAsideMenuComponent', () => {
  let component: LocationAsideMenuComponent;
  let fixture: ComponentFixture<LocationAsideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationAsideMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationAsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
