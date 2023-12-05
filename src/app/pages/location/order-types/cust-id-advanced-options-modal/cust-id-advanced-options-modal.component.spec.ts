import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustIdAdvancedOptionsModalComponent } from './cust-id-advanced-options-modal.component';

describe('CustIdAdvancedOptionsModalComponent', () => {
  let component: CustIdAdvancedOptionsModalComponent;
  let fixture: ComponentFixture<CustIdAdvancedOptionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustIdAdvancedOptionsModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustIdAdvancedOptionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
