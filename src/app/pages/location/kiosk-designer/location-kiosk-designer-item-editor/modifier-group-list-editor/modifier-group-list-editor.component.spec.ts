import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierGroupListEditorComponent } from './modifier-group-list-editor.component';

describe('ModifierListEditorComponent', () => {
  let component: ModifierGroupListEditorComponent;
  let fixture: ComponentFixture<ModifierGroupListEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierGroupListEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierGroupListEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
