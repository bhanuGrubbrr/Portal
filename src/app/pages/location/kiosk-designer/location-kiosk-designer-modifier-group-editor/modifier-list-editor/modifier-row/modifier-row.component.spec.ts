import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierRowComponent } from './modifier-row.component';

describe('ModifierRowComponent', () => {
  let component: ModifierRowComponent;
  let fixture: ComponentFixture<ModifierRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierRowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
