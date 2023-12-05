import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListEditorComponent } from './item-list-editor.component';

describe('ModifierListEditorComponent', () => {
  let component: ItemListEditorComponent;
  let fixture: ComponentFixture<ItemListEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemListEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
