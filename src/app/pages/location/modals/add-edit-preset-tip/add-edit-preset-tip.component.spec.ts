import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPresetTipComponent } from './add-edit-preset-tip.component';

describe('AddEditPresetTipComponent', () => {
  let component: AddEditPresetTipComponent;
  let fixture: ComponentFixture<AddEditPresetTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditPresetTipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPresetTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
