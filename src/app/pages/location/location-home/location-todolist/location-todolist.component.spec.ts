import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationToDoListComponent } from './location-todolist.component';

describe('LocationListComponent', () => {
  let component: LocationToDoListComponent;
  let fixture: ComponentFixture<LocationToDoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationToDoListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationToDoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
