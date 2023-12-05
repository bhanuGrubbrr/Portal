import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityBadgeComponent } from './entity-badge.component';

describe('EntityBadgeComponent', () => {
  let component: EntityBadgeComponent;
  let fixture: ComponentFixture<EntityBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityBadgeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
