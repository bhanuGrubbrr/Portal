import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanymodalComponent } from './companymodal.component';

describe('CompanymodalComponent', () => {
  let component: CompanymodalComponent;
  let fixture: ComponentFixture<CompanymodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanymodalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanymodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
