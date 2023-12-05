import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyAsideMenuComponent } from './company-aside-menu.component';

describe('CompanyAsideMenuComponent', () => {
  let component: CompanyAsideMenuComponent;
  let fixture: ComponentFixture<CompanyAsideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyAsideMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAsideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
