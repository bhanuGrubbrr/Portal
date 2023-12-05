import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityListBreadcrumbsComponent } from './entity-list-breadcrumbs.component';

describe('EntityListBreadcrumbsComponent', () => {
  let component: EntityListBreadcrumbsComponent;
  let fixture: ComponentFixture<EntityListBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityListBreadcrumbsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityListBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
