import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePrinterModelComponent } from './delete-printer-model.component';

describe('DeletePrinterModelComponent', () => {
  let component: DeletePrinterModelComponent;
  let fixture: ComponentFixture<DeletePrinterModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePrinterModelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePrinterModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
