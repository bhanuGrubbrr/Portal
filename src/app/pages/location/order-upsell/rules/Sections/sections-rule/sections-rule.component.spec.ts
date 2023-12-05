import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionsRuleComponent } from './sections-rule.component';

describe('SectionsRuleComponent', () => {
  let component: SectionsRuleComponent;
  let fixture: ComponentFixture<SectionsRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SectionsRuleComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionsRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
