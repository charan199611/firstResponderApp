import { TestBed } from '@angular/core/testing';

import { CommonServices } from './common-services';

describe('CommonServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonServices = TestBed.get(CommonServices);
    expect(service).toBeTruthy();
  });
});
