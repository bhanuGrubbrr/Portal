import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationToDoItemComponent } from './location-todo-item.component';

describe('LocationTodoItemComponent', () => {
  let component: LocationToDoItemComponent;
  let fixture: ComponentFixture<LocationToDoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationToDoItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationToDoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
