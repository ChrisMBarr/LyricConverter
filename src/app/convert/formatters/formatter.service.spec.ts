import { TestBed } from '@angular/core/testing';

import { FormatterService } from './formatter.service';
import { IRawDataFile } from 'src/app/shared/file.model';
import { FormatText } from './format-text';
import { FormatProPresenter } from './format-propresenter';
import { FormatLyricConverter } from './format-lyric-converter';

describe('FormatterService', () => {
  let service: FormatterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('detectFormat()', () => {
    it('should return undefined when a file type cannot be detected', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'png',
        type: 'image/png',
        data: "\x89PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\b\x04\x00\x00\x00µ\x1C\f\x02\x00\x00\x00\vIDATxÚcdø\x0F\x00\x01\x05\x01\x01'\x18ãf\x00\x00\x00\x00IEND®B`\x82",
      };

      expect(service.detectFormatAndGetFormatter(testFile)).toEqual(undefined);
    });

    it('should properly detect a plain text file', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'txt',
        type: 'text/plain',
        data: 'this is some plain text',
      };

      const expectedClass = service.formatters.find((c) => {
        return c instanceof FormatText;
      });
      expect(service.detectFormatAndGetFormatter(testFile)).toEqual(expectedClass);
    });

    it('should properly detect a ProPresenter file', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'pro5',
        type: '',
        data: '<RVPresentationDocument height="768" width="1024" versionNumber="500" docType="0"></RVPresentationDocument>',
      };

      const expectedClass = service.formatters.find((c) => {
        return c instanceof FormatProPresenter;
      });
      expect(service.detectFormatAndGetFormatter(testFile)).toEqual(expectedClass);
    });

    it('should properly detect a LyricConverter JSON file', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        data: '{}',
      };

      const expectedClass = service.formatters.find((c) => {
        return c instanceof FormatLyricConverter;
      });
      expect(service.detectFormatAndGetFormatter(testFile)).toEqual(expectedClass);
    });
  });
});
