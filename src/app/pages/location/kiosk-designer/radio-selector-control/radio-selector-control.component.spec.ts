import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioSelectorControlComponent } from './radio-selector-control.component';

describe('RadioSelectorControlComponent', () => {
  let component: RadioSelectorControlComponent<string>;
  let fixture: ComponentFixture<RadioSelectorControlComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioSelectorControlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadioSelectorControlComponent) as any;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
