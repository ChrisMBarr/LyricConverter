import { TestBed } from '@angular/core/testing';
import { TestUtils } from 'test/test-utils';

import { ErrorsService } from '../errors/errors.service';
import { InputTypeJSON } from '../inputs/input-type-json';
import { InputTypePlainText } from '../inputs/input-type-plain-text';
import { InputTypeProPresenter5 } from '../inputs/input-type-propresenter5';
import { IRawDataFile } from '../models/file.model';
import { ParserService } from './parser.service';

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
          dataAsBuffer: new ArrayBuffer(30),
          dataAsString: 'this is some text for testing!',
          ext: '',
          name: 'no-extension',
          type: 'text/plain',
        };

        //We can't really compare ArrayBuffers, so we'll just compare the bytelength
        expect(value[0]?.dataAsBuffer.byteLength).toEqual(expectedParsedFile.dataAsBuffer.byteLength);
        expect(value[0]?.dataAsString).toEqual(expectedParsedFile.dataAsString);
        expect(value[0]?.ext).toEqual(expectedParsedFile.ext);
        expect(value[0]?.name).toEqual(expectedParsedFile.name);
        expect(value[0]?.type).toEqual(expectedParsedFile.type);
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
          dataAsBuffer: new ArrayBuffer(36),
          dataAsString: 'this is some other text for testing!',
          ext: 'txt',
          name: 'ěščřžýáíé åäö',
          type: 'text/plain',
        };

        //We can't really compare ArrayBuffers, so we'll just compare the bytelength
        expect(value[0]?.dataAsBuffer.byteLength).toEqual(expectedParsedFile.dataAsBuffer.byteLength);
        expect(value[0]?.dataAsString).toEqual(expectedParsedFile.dataAsString);
        expect(value[0]?.ext).toEqual(expectedParsedFile.ext);
        expect(value[0]?.name).toEqual(expectedParsedFile.name);
        expect(value[0]?.type).toEqual(expectedParsedFile.type);
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
    it('should return undefined when a file type cannot be detected', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('image', 'mr-bean.png');
      expect(service.detectInputTypeAndGetConverter(testFile)).toEqual(undefined);
    });

    it('should properly detect a plain text file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'empty.txt');

      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypePlainText;
      });
      expect(service.detectInputTypeAndGetConverter(testFile)).toEqual(expectedClass);
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

    it('should properly detect a JSON file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');

      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypeJSON;
      });
      expect(service.detectInputTypeAndGetConverter(testFile)).toEqual(expectedClass);
    });
  });
});
