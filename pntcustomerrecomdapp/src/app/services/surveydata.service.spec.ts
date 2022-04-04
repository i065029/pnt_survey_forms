import { TestBed } from '@angular/core/testing';

import { SurveydataService } from './surveydata.service';

describe('SurveydataService', () => {
  let service: SurveydataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveydataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
