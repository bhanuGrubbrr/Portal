import { TestBed } from '@angular/core/testing';

import { LocationPosService } from './location-pos.service';

describe('LocationPosService', () => {
  let service: LocationPosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationPosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
