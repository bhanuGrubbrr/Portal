import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityRowImageComponent } from './entity-row-image.component';

describe('EntityRowImageComponent', () => {
  let component: EntityRowImageComponent;
  let fixture: ComponentFixture<EntityRowImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntityRowImageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityRowImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
