import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCategoryRowComponent } from './menu-category-row.component';

describe('MenuCategoryRowComponent', () => {
  let component: MenuCategoryRowComponent;
  let fixture: ComponentFixture<MenuCategoryRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuCategoryRowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuCategoryRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
