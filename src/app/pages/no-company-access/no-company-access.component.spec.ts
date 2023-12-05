import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCompanyAccessComponent } from './no-company-access.component';

describe('NoCompanyAccessComponent', () => {
  let component: NoCompanyAccessComponent;
  let fixture: ComponentFixture<NoCompanyAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NoCompanyAccessComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoCompanyAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
