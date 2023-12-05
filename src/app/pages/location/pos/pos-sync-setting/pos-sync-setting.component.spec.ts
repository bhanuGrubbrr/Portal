import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSyncSettingComponent } from './pos-sync-setting.component';

describe('PosSettingComponent', () => {
  let component: PosSyncSettingComponent;
  let fixture: ComponentFixture<PosSyncSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosSyncSettingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSyncSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
