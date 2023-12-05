import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyIntegrationsComponent } from './loyalty-integrations.component';

describe('LoyaltyIntegrationsComponent', () => {
  let component: LoyaltyIntegrationsComponent;
  let fixture: ComponentFixture<LoyaltyIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoyaltyIntegrationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
