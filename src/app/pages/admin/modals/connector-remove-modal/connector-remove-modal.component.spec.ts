import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorRemoveModalComponent } from './connector-remove-modal.component';

describe('ConnectorRemoveModalComponent', () => {
  let component: ConnectorRemoveModalComponent;
  let fixture: ComponentFixture<ConnectorRemoveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorRemoveModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorRemoveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
