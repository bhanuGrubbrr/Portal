import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageGuardsComponent } from './message-guards.component';

describe('MessageGuardsComponent', () => {
  let component: MessageGuardsComponent;
  let fixture: ComponentFixture<MessageGuardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MessageGuardsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageGuardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
