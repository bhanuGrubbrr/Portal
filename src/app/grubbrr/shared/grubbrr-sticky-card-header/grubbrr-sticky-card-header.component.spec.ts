import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrubbrrStickyCardHeaderComponent } from './grubbrr-sticky-card-header.component';

describe('GrubbrrStickyCardHeaderComponent', () => {
  let component: GrubbrrStickyCardHeaderComponent;
  let fixture: ComponentFixture<GrubbrrStickyCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GrubbrrStickyCardHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrubbrrStickyCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
