import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveIntegrationComponent } from './remove-integration.component';

describe('RemoveIntegrationComponent', () => {
  let component: RemoveIntegrationComponent;
  let fixture: ComponentFixture<RemoveIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RemoveIntegrationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
