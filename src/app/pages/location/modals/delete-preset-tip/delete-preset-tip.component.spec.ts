import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePresetTipComponent } from './delete-preset-tip.component';

describe('DeletePresetTipComponent', () => {
  let component: DeletePresetTipComponent;
  let fixture: ComponentFixture<DeletePresetTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePresetTipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePresetTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
