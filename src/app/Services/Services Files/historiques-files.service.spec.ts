import { TestBed } from '@angular/core/testing';

import { HistoriquesFilesService } from './historiques-files.service';

describe('HistoriquesFilesService', () => {
  let service: HistoriquesFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriquesFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
