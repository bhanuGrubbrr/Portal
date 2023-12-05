import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDeactivateComponent } from './company-deactivate.component';

describe('CompanyDeactivateComponent', () => {
  let component: CompanyDeactivateComponent;
  let fixture: ComponentFixture<CompanyDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyDeactivateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
