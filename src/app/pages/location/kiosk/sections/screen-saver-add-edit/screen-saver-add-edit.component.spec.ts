import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenSaverAddEditComponent } from './screen-saver-add-edit.component';

describe('ScreenSaverAddEditComponent', () => {
  let component: ScreenSaverAddEditComponent;
  let fixture: ComponentFixture<ScreenSaverAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenSaverAddEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenSaverAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
