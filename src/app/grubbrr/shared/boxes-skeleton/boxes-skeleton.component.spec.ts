import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesSkeletonComponent } from './boxes-skeleton.component';

describe('BoxesSkeletonComponent', () => {
  let component: BoxesSkeletonComponent;
  let fixture: ComponentFixture<BoxesSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoxesSkeletonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
