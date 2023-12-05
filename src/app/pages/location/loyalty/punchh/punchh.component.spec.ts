import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunchhComponent } from './punchh.component';

describe('PunchhComponent', () => {
  let component: PunchhComponent;
  let fixture: ComponentFixture<PunchhComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PunchhComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PunchhComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
