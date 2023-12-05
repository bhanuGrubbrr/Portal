import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearanceAssetComponent } from './appearance-asset.component';

describe('AppearanceAssetComponent', () => {
  let component: AppearanceAssetComponent;
  let fixture: ComponentFixture<AppearanceAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppearanceAssetComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppearanceAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
