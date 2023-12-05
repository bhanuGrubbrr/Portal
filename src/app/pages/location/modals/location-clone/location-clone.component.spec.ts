import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCloneComponent } from './location-clone.component';

describe('LocationCloneComponent', () => {
  let component: LocationCloneComponent;
  let fixture: ComponentFixture<LocationCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationCloneComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
