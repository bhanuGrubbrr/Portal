import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyDefaultImagesComponent } from './loyalty-default-images.component';

describe('LoyaltyDefaultImagesComponent', () => {
  let component: LoyaltyDefaultImagesComponent;
  let fixture: ComponentFixture<LoyaltyDefaultImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoyaltyDefaultImagesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyDefaultImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
