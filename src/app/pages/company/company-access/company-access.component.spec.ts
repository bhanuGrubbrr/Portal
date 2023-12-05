import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAccessComponent } from './company-access.component';

describe('CompanyAccessComponent', () => {
  let component: CompanyAccessComponent;
  let fixture: ComponentFixture<CompanyAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyAccessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
