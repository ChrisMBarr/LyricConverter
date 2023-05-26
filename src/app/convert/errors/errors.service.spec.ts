import { TestBed } from '@angular/core/testing';

import { ErrorsService } from './errors.service';
import { LyricConverterError } from '../models/errors.model';

describe('ErrorsService', () => {
  let service: ErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit the list of errors when an error with only a message is added', (done: DoneFn) => {
    service.errorsChanged$.subscribe((list) => {
      expect(list).toEqual([{ message: '[[TEST:errors.service.spec.ts]] Test Message 1' }]);
      done();
    });

    service.add({ message: '[[TEST:errors.service.spec.ts]] Test Message 1' });
  });

  it('should emit the list of errors when an error with a message and a file name is added', (done: DoneFn) => {
    service.errorsChanged$.subscribe((list) => {
      expect(list).toEqual([
        { message: '[[TEST:errors.service.spec.ts]] Test Message 2', fileName: 'example-file.exe' },
      ]);
      done();
    });

    service.add({
      message: '[[TEST:errors.service.spec.ts]] Test Message 2',
      fileName: 'example-file.exe',
    });
  });

  it('should emit the list of errors and use the default message when a native error object is attached', (done: DoneFn) => {
    const nativeErrorObj = new Error('do not use this message');

    service.errorsChanged$.subscribe((list) => {
      expect(list).toEqual([
        {
          message: '[[TEST:errors.service.spec.ts]] Test Message 3',
          fileName: 'example-file.exe',
          thrownError: nativeErrorObj,
        },
      ]);
      done();
    });

    service.add({
      message: '[[TEST:errors.service.spec.ts]] Test Message 3',
      fileName: 'example-file.exe',
      thrownError: nativeErrorObj,
    });
  });

  it('should emit the list of errors and use the custom error message instead of the default message when a custom error object is attached', (done: DoneFn) => {
    const customErrorObj = new LyricConverterError(
      '[[TEST:errors.service.spec.ts]] Test Message 4'
    );

    service.errorsChanged$.subscribe((list) => {
      expect(list).toEqual([
        { message: '[[TEST:errors.service.spec.ts]] Test Message 4', fileName: 'example-file.exe', thrownError: customErrorObj },
      ]);
      done();
    });

    service.add({
      message: 'default message',
      fileName: 'example-file.exe',
      thrownError: customErrorObj,
    });
  });

  it('should emit an empty list of errors when it is cleared', (done: DoneFn) => {
    service.add({ message: '[[TEST:errors.service.spec.ts]] Test Message 5' });

    service.errorsChanged$.subscribe((list) => {
      expect(list).toEqual([]);
      done();
    });

    service.clear();
  });
});
