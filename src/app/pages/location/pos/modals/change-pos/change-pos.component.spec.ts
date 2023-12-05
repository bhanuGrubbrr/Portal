import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePOSComponent } from './change-pos.component';

describe('ChangePOSComponent', () => {
  let component: ChangePOSComponent;
  let fixture: ComponentFixture<ChangePOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangePOSComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
