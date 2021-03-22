import { TestBed } from '@angular/core/testing';

import { CustomNavService } from './custom-nav.service';

describe('CustomNavService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomNavService = TestBed.get(CustomNavService);
    expect(service).toBeTruthy();
  });
});
