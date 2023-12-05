import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrubbrrSwitchFormControlComponent } from './grubbrr-switch-form-control.component';

describe('GrubbrrSwitchFormControlComponent', () => {
  let component: GrubbrrSwitchFormControlComponent;
  let fixture: ComponentFixture<GrubbrrSwitchFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrubbrrSwitchFormControlComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrubbrrSwitchFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
