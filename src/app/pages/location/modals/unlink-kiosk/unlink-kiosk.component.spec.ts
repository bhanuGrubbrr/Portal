import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlinkKioskComponent } from './unlink-kiosk.component';

describe('UnlinkKioskComponent', () => {
  let component: UnlinkKioskComponent;
  let fixture: ComponentFixture<UnlinkKioskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnlinkKioskComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnlinkKioskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
