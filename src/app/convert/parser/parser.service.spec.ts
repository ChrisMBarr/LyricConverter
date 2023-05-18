import { TestBed } from '@angular/core/testing';

import { ParserService } from './parser.service';
import { IFileWithData, IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeJSON } from '../inputs/input-type-json';
import { InputTypeProPresenter } from '../inputs/input-type-propresenter';
import { InputTypeText } from '../inputs/input-type-text';
import * as mockRawFiles from 'test/mock-raw-files';

describe('ParserService', () => {
  let service: ParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('parseFiles()', () => {
    it('should return an empty array if an empty array is passed in', () => {
      expect(service.parseFiles([])).toEqual([]);
    });

    it('should return a properly formatted RawDataFile with decoded content', () => {
      const inputFile: IFileWithData = {
        data: 'data:text/plain;base64,dGhpcyBpcyBzb21lIHRleHQgZm9yIHRlc3Rpbmch',
        ext: 'txt',
        lastModified: 1684251444527,
        name: 'test-file.txt',
        nameWithoutExt: 'test-file',
        size: 30,
        type: 'text/plain',
      };

      const expectedParsedFile: IRawDataFile = {
        data: 'this is some text for testing!',
        ext: 'txt',
        name: 'test-file',
        type: 'text/plain',
      };
      expect(service.parseFiles([inputFile])).toEqual([expectedParsedFile]);
    });
  });

  describe('detectInputTypeAndGetConverter()', () => {
    it('should return undefined when a file type cannot be detected', () => {
      expect(service.detectInputTypeAndGetConverter(mockRawFiles.mockImageFile)).toEqual(undefined);
    });

    it('should properly detect a plain text file', () => {
      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypeText;
      });
      expect(service.detectInputTypeAndGetConverter(mockRawFiles.mockSimpleTextFile)).toEqual(
        expectedClass
      );
    });

    it('should properly detect a ProPresenter file', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'pro5',
        type: '',
        data: '<RVPresentationDocument height="768" width="1024" versionNumber="500" docType="0"></RVPresentationDocument>',
      };

      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypeProPresenter;
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
