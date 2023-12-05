import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTypeaheadSearchComponent } from './entity-typeahead-search.component';

describe('EntityTypeaheadSearchComponent', () => {
  let component: EntityTypeaheadSearchComponent<any>;
  let fixture: ComponentFixture<EntityTypeaheadSearchComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityTypeaheadSearchComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTypeaheadSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
