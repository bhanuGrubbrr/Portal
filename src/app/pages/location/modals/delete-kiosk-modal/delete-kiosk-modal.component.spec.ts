import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteKioskModalComponent } from './delete-kiosk-modal.component';

describe('DeleteKioskModalComponent', () => {
  let component: DeleteKioskModalComponent;
  let fixture: ComponentFixture<DeleteKioskModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteKioskModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteKioskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
