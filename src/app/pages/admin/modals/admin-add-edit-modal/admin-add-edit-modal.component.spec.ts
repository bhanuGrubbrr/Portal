import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddEditModalComponent } from './admin-add-edit-modal.component';

describe('AdminAddEditModalComponent', () => {
  let component: AdminAddEditModalComponent;
  let fixture: ComponentFixture<AdminAddEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAddEditModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAddEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
