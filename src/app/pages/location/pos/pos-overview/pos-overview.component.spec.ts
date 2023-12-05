import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosOverviewComponent } from './pos-overview.component';

describe('PosOverviewComponent', () => {
  let component: PosOverviewComponent;
  let fixture: ComponentFixture<PosOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosOverviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
