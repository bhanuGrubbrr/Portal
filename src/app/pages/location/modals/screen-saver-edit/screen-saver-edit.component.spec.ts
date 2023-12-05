import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenSaverEditComponent } from './screen-saver-edit.component';

describe('ScreenSaverEditComponent', () => {
  let component: ScreenSaverEditComponent;
  let fixture: ComponentFixture<ScreenSaverEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenSaverEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreenSaverEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
