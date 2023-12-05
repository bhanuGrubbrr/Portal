import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenSaverDeleteComponent } from './screen-saver-delete.component';

describe('ScreenSaverDeleteComponent', () => {
  let component: ScreenSaverDeleteComponent;
  let fixture: ComponentFixture<ScreenSaverDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenSaverDeleteComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenSaverDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
