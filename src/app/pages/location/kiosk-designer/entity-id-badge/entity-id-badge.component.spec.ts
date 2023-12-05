import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityIdBadgeComponent } from './entity-id-badge.component';

describe('EntityIdBadgeComponent', () => {
  let component: EntityIdBadgeComponent;
  let fixture: ComponentFixture<EntityIdBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityIdBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityIdBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
