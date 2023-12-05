import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosProxyOnboardCodeComponent } from './pos-proxy-onboard-code.component';

describe('PosProxyOnboardCodeComponent', () => {
  let component: PosProxyOnboardCodeComponent;
  let fixture: ComponentFixture<PosProxyOnboardCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosProxyOnboardCodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosProxyOnboardCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
