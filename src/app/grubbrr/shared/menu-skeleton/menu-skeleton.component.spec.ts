import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuSkeletonComponent } from './menu-skeleton.component';

describe('MenuSkeletonComponent', () => {
  let component: MenuSkeletonComponent;
  let fixture: ComponentFixture<MenuSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuSkeletonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
