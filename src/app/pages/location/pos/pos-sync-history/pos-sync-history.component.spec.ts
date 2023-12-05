import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSyncHistoryComponent } from './pos-sync-history.component';

describe('PosSyncHistoryComponent', () => {
  let component: PosSyncHistoryComponent;
  let fixture: ComponentFixture<PosSyncHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PosSyncHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSyncHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
