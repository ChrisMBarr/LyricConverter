import { TestBed } from '@angular/core/testing';

import { FormatterService } from './formatter.service';

describe('FormatterService', () => {
  let service: FormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
