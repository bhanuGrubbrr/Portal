import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEntityButtonComponent } from './add-entity-button.component';

describe('AddEntityButtonComponent', () => {
  let component: AddEntityButtonComponent;
  let fixture: ComponentFixture<AddEntityButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEntityButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEntityButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
