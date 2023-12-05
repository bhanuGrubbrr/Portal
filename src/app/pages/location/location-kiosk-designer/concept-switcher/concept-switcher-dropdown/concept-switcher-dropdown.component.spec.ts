import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptSwitcherDropdownComponent } from './concept-switcher-dropdown.component';

describe('ConceptsComponent', () => {
  let component: ConceptSwitcherDropdownComponent;
  let fixture: ComponentFixture<ConceptSwitcherDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConceptSwitcherDropdownComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptSwitcherDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
