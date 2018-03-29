import { TestBed, inject } from '@angular/core/testing';

import { SinchService } from './sinch.service';

describe('SinchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SinchService]
    });
  });

  it('should be created', inject([SinchService], (service: SinchService) => {
    expect(service).toBeTruthy();
  }));
});
