import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoverridesComponent } from './textoverrides.component';

describe('TextoverridesComponent', () => {
  let component: TextoverridesComponent;
  let fixture: ComponentFixture<TextoverridesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TextoverridesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextoverridesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
