import { ComponentFixture, TestBed } from '@angular/core/testing';

import ShowMoreShowLessButtonComponent from './show-more-show-less-button.component';

describe('ShowMoreShowLessButtonComponent', () => {
  let component: ShowMoreShowLessButtonComponent;
  let fixture: ComponentFixture<ShowMoreShowLessButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowMoreShowLessButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMoreShowLessButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
