import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeoutsComponent } from './timeouts.component';

describe('TimeoutsComponent', () => {
  let component: TimeoutsComponent;
  let fixture: ComponentFixture<TimeoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimeoutsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
