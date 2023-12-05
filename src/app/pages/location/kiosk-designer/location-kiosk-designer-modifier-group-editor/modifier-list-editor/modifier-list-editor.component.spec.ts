import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierListEditorComponent } from './modifier-list-editor.component';

describe('ModifierListEditorComponent', () => {
  let component: ModifierListEditorComponent;
  let fixture: ComponentFixture<ModifierListEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifierListEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierListEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
