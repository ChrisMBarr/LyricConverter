import { TestBed } from '@angular/core/testing';

import { ParserService } from './parser.service';
import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeJSON } from '../inputs/input-type-json';
import { InputTypeProPresenter5 } from '../inputs/input-type-propresenter5';
import { InputTypePlainText } from '../inputs/input-type-plain-text';
import * as mockRawFiles from 'test/mock-raw-files';
import { ErrorsService } from '../errors/errors.service';

describe('ParserService', () => {
  let service: ParserService;
  let injectedErrorsSvc: ErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorsService],
    });
    service = TestBed.inject(ParserService);
    injectedErrorsSvc = TestBed.inject(ErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parseFiles()', () => {
    it('should emit a properly formatted RawDataFile with decoded content', (done: DoneFn) => {
      service.parsedFilesChanged$.subscribe((value) => {
        const expectedParsedFile: IRawDataFile = {
          dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
          dataAsString: 'this is some text for testing!',
          ext: '',
          name: 'no-extension',
          type: 'text/plain',
        };

        expect(value).toEqual([expectedParsedFile]);
        done();
      });

      const dt = new DataTransfer();
      const file = new File(['this is some text for testing!'], 'no-extension', {
        lastModified: 1684251444527,
        type: 'text/plain',
      });
      dt.items.add(file);
      service.parseFiles(dt.files);
    });

    it('should return correctly with a unicode file name', (done: DoneFn) => {
      service.parsedFilesChanged$.subscribe((value) => {
        const expectedParsedFile: IRawDataFile = {
          dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
          dataAsString: 'this is some other text for testing!',
          ext: 'txt',
          name: 'ěščřžýáíé åäö',
          type: 'text/plain',
        };

        expect(value).toEqual([expectedParsedFile]);
        done();
      });

      const dt = new DataTransfer();
      const file = new File(['this is some other text for testing!'], 'ěščřžýáíé åäö.txt', {
        lastModified: 1684251444527,
        type: 'text/plain',
      });
      dt.items.add(file);
      service.parseFiles(dt.files);
    });

    it('should call the ErrorService when a weird file fails to be read', () => {
      spyOn(injectedErrorsSvc, 'add');
      //@ts-expect-error - Purposely pass bad data that would otherwise break things to test this
      service.parseFiles(['🚫👎🏼⛔🙅🏼‍♀️'] as FileList);

      expect(injectedErrorsSvc.add).toHaveBeenCalled();
    });
  });

  describe('detectInputTypeAndGetConverter()', () => {
    it('should return undefined when a file type cannot be detected', () => {
      expect(service.detectInputTypeAndGetConverter(mockRawFiles.mockImageFile)).toEqual(undefined);
    });

    it('should properly detect a plain text file', () => {
      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypePlainText;
      });
      expect(service.detectInputTypeAndGetConverter(mockRawFiles.mockEmptyTextFile)).toEqual(
        expectedClass
      );
    });

    it('should properly detect a ProPresenter5 file', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'pro5',
        type: '',
        dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
        dataAsString: '<RVPresentationDocument height="768" width="1024" versionNumber="500" docType="0"></RVPresentationDocument>',
      };

      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypeProPresenter5;
      });
      expect(service.detectInputTypeAndGetConverter(testFile)).toEqual(expectedClass);
    });

    it('should properly detect a JSON file', () => {
      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypeJSON;
      });
      expect(service.detectInputTypeAndGetConverter(mockRawFiles.mockEmptyJsonFile)).toEqual(
        expectedClass
      );
    });
  });
});
