import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyRemoveAccessModalComponent } from './company-access-remove-user-modal.component';

describe('CompanyRemoveAccessModalComponent', () => {
  let component: CompanyRemoveAccessModalComponent;
  let fixture: ComponentFixture<CompanyRemoveAccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyRemoveAccessModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyRemoveAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
