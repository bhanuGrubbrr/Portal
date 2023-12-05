import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyLoyaltyComponent } from './company-loyalty.component';

describe('CompanyLoyaltyComponent', () => {
  let component: CompanyLoyaltyComponent;
  let fixture: ComponentFixture<CompanyLoyaltyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyLoyaltyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyLoyaltyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
