import { TestBed, inject } from '@angular/core/testing';

import { CallcenterService } from './callcenter.service';

describe('CallcenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CallcenterService]
    });
  });

  it('should be created', inject([CallcenterService], (service: CallcenterService) => {
    expect(service).toBeTruthy();
  }));
});
