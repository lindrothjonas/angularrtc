import { TestBed, inject } from '@angular/core/testing';

import { CallingService } from './calling.service';

describe('CallingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallingService]
    });
  });

  it('should be created', inject([CallingService], (service: CallingService) => {
    expect(service).toBeTruthy();
  }));
});
