import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKioskComponent } from './add-kiosk.component';

describe('AddKioskComponent', () => {
  let component: AddKioskComponent;
  let fixture: ComponentFixture<AddKioskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddKioskComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
