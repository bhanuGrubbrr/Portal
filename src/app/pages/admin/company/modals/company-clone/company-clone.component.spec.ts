import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCloneComponent } from './company-clone.component';

describe('CompanyCloneComponent', () => {
  let component: CompanyCloneComponent;
  let fixture: ComponentFixture<CompanyCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyCloneComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
