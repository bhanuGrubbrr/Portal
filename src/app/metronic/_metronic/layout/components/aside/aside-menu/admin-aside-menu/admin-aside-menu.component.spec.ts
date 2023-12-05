import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAsideMenuComponent } from './admin-aside-menu.component';

describe('AdminAsideMenuComponent', () => {
  let component: AdminAsideMenuComponent;
  let fixture: ComponentFixture<AdminAsideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAsideMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
