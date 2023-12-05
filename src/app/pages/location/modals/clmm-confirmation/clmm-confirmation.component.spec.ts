import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClmmConfirmationComponent } from './clmm-confirmation.component';

describe('ClmmConfirmationComponent', () => {
  let component: ClmmConfirmationComponent;
  let fixture: ComponentFixture<ClmmConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClmmConfirmationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClmmConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
