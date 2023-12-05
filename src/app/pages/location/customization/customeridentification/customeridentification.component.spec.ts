import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomeridentificationComponent } from './customeridentification.component';

describe('CustomeridentificationComponent', () => {
  let component: CustomeridentificationComponent;
  let fixture: ComponentFixture<CustomeridentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomeridentificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomeridentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
