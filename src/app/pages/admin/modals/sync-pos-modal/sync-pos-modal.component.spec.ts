import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncPosModalComponent } from './sync-pos-modal.component';

describe('SyncPosModalComponent', () => {
  let component: SyncPosModalComponent;
  let fixture: ComponentFixture<SyncPosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SyncPosModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncPosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
