import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierGroupsComponent } from './modifier-groups.component';

describe('ModifierGroupsComponent', () => {
  let component: ModifierGroupsComponent;
  let fixture: ComponentFixture<ModifierGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierGroupsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
