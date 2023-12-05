import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectorStatusComponent } from './connector-status.component';

describe('ConnectorStatusComponent', () => {
  let component: ConnectorStatusComponent;
  let fixture: ComponentFixture<ConnectorStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectorStatusComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectorStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
