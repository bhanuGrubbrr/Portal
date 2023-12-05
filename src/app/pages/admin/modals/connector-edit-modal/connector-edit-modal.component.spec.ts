import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorEditModalComponent } from './connector-edit-modal.component';

describe('ConnectorEditModalComponent', () => {
  let component: ConnectorEditModalComponent;
  let fixture: ComponentFixture<ConnectorEditModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorEditModalComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
