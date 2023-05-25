import { TestBed } from '@angular/core/testing';

import { ErrorsService } from './errors.service';

describe('ErrorsService', () => {
  let service: ErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the list of errors from the subject when one is added', (done: DoneFn) => {
    service.errorsChanged$.subscribe((list) => {
      expect(list).toEqual([{ message: '[[TEST:errors.service.spec.ts]] Test Message 1' }]);
      done();
    });

    service.add({ message: '[[TEST:errors.service.spec.ts]] Test Message 1' });
  });

  it('should emit an empty list of errors from the subject when it is cleared', (done: DoneFn) => {
    service.add({ message: '[[TEST:errors.service.spec.ts]] Test Message 2' });

    service.errorsChanged$.subscribe((list) => {
      expect(list).toEqual([]);
      done();
    });

    service.clear();
  });
});
