import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSwitcherComponent } from './concept-switcher.component';

describe('ConceptsComponent', () => {
  let component: ConceptSwitcherComponent;
  let fixture: ComponentFixture<ConceptSwitcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConceptSwitcherComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
