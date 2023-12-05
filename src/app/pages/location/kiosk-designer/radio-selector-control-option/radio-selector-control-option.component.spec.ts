import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioSelectorControlOptionComponent } from './radio-selector-control-option.component';

describe('RadioSelectorControlOptionComponent', () => {
  let component: RadioSelectorControlOptionComponent;
  let fixture: ComponentFixture<RadioSelectorControlOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioSelectorControlOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioSelectorControlOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
