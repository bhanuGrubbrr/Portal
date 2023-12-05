import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityListRemoveButtonComponent } from './entity-list-remove-button.component';

describe('EntityListRemoveButtonComponent', () => {
  let component: EntityListRemoveButtonComponent;
  let fixture: ComponentFixture<EntityListRemoveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityListRemoveButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityListRemoveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
