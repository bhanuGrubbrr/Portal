import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrubbrrSwitchComponent } from './grubbrr-switch.component';

describe('GrubbrrSwitchComponent', () => {
  let component: GrubbrrSwitchComponent;
  let fixture: ComponentFixture<GrubbrrSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrubbrrSwitchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrubbrrSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
