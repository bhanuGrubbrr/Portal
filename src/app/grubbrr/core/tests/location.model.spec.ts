import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationModel } from 'src/app/grubbrr/core/models/location/location.model';
import { LocationListComponent } from 'src/app/pages/company/location-list/location-list.component';

describe('LocationsComponent', () => {
  let component: LocationListComponent;
  let fixture: ComponentFixture<LocationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LocationListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
