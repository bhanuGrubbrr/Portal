import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardBinRangeComponent } from './gift-card-bin-range.component';

describe('GiftCardBinRangeComponent', () => {
  let component: GiftCardBinRangeComponent;
  let fixture: ComponentFixture<GiftCardBinRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GiftCardBinRangeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardBinRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
