import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginatotronComponent } from './paginatotron.component';

describe('PaginatorComponent', () => {
  let component: PaginatotronComponent<any>;
  let fixture: ComponentFixture<PaginatotronComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginatotronComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginatotronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
