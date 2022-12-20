import { TestBed } from '@angular/core/testing';

import { CurricularUnitsService } from './curricular-units.service';

describe('CurricularUnitsService', () => {
  let service: CurricularUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurricularUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
