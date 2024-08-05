import { TestBed } from '@angular/core/testing';

import { ClearLocalStorageResolverService } from './clear-local-storage-resolver.service';

describe('ClearLocalStorageResolverService', () => {
  let service: ClearLocalStorageResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClearLocalStorageResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
