import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSyncDetailModalComponent } from './menu-sync-detail-modal.component';

describe('MenuSyncDetailModalComponent', () => {
  let component: MenuSyncDetailModalComponent;
  let fixture: ComponentFixture<MenuSyncDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuSyncDetailModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSyncDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
