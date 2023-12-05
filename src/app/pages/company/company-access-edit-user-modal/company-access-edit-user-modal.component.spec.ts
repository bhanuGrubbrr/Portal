import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompanyAccessModalComponent } from './company-access-edit-user-modal.component';

describe('EditCompanyAccessModalComponent', () => {
  let component: EditCompanyAccessModalComponent;
  let fixture: ComponentFixture<EditCompanyAccessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCompanyAccessModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCompanyAccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
