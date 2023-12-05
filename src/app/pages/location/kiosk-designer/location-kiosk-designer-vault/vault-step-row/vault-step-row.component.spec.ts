import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultStepRowComponent } from './vault-step-row.component';

describe('VaultStepRowComponent', () => {
  let component: VaultStepRowComponent;
  let fixture: ComponentFixture<VaultStepRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VaultStepRowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultStepRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
