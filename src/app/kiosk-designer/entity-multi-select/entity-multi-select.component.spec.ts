import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuCategory } from 'src/app/grubbrr/service/menu.service';

import { EntityMultiSelectComponent } from './entity-multi-select.component';

describe('EntityMultiSelectComponent', () => {
  let component: EntityMultiSelectComponent<MenuCategory>;
  let fixture: ComponentFixture<EntityMultiSelectComponent<MenuCategory>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityMultiSelectComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityMultiSelectComponent) as any;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
