import { TestBed } from '@angular/core/testing';

import { MessageServicesService } from './message-services.service';

describe('MessageServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MessageServicesService = TestBed.get(MessageServicesService);
    expect(service).toBeTruthy();
  });
});
