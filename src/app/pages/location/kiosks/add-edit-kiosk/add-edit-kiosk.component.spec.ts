import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditKioskComponent } from './add-edit-kiosk.component';

describe('AddEditKioskComponent', () => {
  let component: AddEditKioskComponent;
  let fixture: ComponentFixture<AddEditKioskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditKioskComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
