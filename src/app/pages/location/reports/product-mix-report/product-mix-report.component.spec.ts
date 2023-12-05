import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMixReportComponent } from './product-mix-report.component';

describe('ProductMixReportComponent', () => {
  let component: ProductMixReportComponent;
  let fixture: ComponentFixture<ProductMixReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductMixReportComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductMixReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
