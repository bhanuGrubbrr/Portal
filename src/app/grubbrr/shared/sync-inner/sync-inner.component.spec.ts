import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncInnerComponent } from './sync-inner.component';

describe('SyncInnerComponent', () => {
  let component: SyncInnerComponent;
  let fixture: ComponentFixture<SyncInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncInnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
