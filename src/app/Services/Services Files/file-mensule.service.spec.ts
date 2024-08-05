import { TestBed } from '@angular/core/testing';

import { FileMensuleService } from './file-mensule.service';

describe('FileMensuleService', () => {
  let service: FileMensuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileMensuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
