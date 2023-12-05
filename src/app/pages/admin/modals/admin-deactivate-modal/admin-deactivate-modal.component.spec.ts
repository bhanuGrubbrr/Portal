import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeactivateModalComponent } from './admin-deactivate-modal.component';

describe('AdminDeactivateModalComponent', () => {
  let component: AdminDeactivateModalComponent;
  let fixture: ComponentFixture<AdminDeactivateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDeactivateModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeactivateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
