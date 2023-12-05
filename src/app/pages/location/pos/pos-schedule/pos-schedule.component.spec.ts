import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosScheduleComponent } from './pos-schedule.component';

describe('PosScheduleComponent', () => {
  let component: PosScheduleComponent;
  let fixture: ComponentFixture<PosScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosScheduleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
