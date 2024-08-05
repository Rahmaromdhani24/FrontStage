import { TestBed } from '@angular/core/testing';

import { FileHoraireService } from './file-horaire.service';

describe('FileHoraireService', () => {
  let service: FileHoraireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileHoraireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
