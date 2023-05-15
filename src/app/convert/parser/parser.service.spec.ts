import { TestBed } from '@angular/core/testing';

import { ParserService } from './parser.service';
import { dedent } from 'test/test-utils';
import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeLyricConverter } from '../inputs/input-type-lyric-converter';
import { InputTypeProPresenter } from '../inputs/input-type-propresenter';
import { InputTypeText } from '../inputs/input-type-text';

describe('ParserService', () => {
  let service: ParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('detectInputTypeAndGetConverter()', () => {
    it('should return undefined when a file type cannot be detected', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'png',
        type: 'image/png',
        data: "\x89PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\b\x04\x00\x00\x00µ\x1C\f\x02\x00\x00\x00\vIDATxÚcdø\x0F\x00\x01\x05\x01\x01'\x18ãf\x00\x00\x00\x00IEND®B`\x82",
      };

      expect(service.detectInputTypeAndGetConverter(testFile)).toEqual(undefined);
    });

    it('should properly detect a plain text file', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'txt',
        type: 'text/plain',
        data: 'this is some plain text',
      };

      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypeText;
      });
      expect(service.detectInputTypeAndGetConverter(testFile)).toEqual(
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
      expect(service.detectInputTypeAndGetConverter(testFile)).toEqual(
        expectedClass
      );
    });

    it('should properly detect a LyricConverter JSON file', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        data: '{}',
      };

      const expectedClass = service.inputConverters.find((c) => {
        return c instanceof InputTypeLyricConverter;
      });
      expect(service.detectInputTypeAndGetConverter(testFile)).toEqual(
        expectedClass
      );
    });
  });

  describe('Encode/Decode', () => {
    it('should base64Decode simple strings', () => {
      expect(service.decode('aGVsbG8gd29ybGQ=')).toEqual('hello world');
    });

    it('should base64Decode RTF strings', () => {
      expect(
        service.decode(
          'e1xydGYxXGFuc2lcYW5zaWNwZzEyNTJcY29jb2FydGYxMDM4XGNvY29hc3VicnRmMzIwCntcZm9udHRibFxmMFxmc3dpc3NcZmNoYXJzZXQwIEltcGFjdDt9CntcY29sb3J0Ymw7XHJlZDI1NVxncmVlbjI1NVxibHVlMjU1O30KXHBhcmRcdHg1NjBcdHgxMTIwXHR4MTY4MFx0eDIyNDBcdHgyODAwXHR4MzM2MFx0eDM5MjBcdHg0NDgwXHR4NTA0MFx0eDU2MDBcdHg2MTYwXHR4NjcyMFxxY1xwYXJkaXJuYXR1cmFsCgpcZjBcZnMxMjAgXGNmMSBcb3V0bDBcc3Ryb2tld2lkdGgtNDAgXHN0cm9rZWMwIFdlIGJvdyBvdXIgaGVhcnRzIHdlIGJlbmQgb3VyIGtuZWVzXApPaCBTcGlyaXQgY29tZSBtYWtlIHVzIGh1bWJsZVwKV2UgdHVybiBvdXIgZXllcyBmcm9tIGV2aWwgdGhpbmdzXApPaCBMb3JkIHdlIGNhc3QgZG93biBvdXIgaWRvbHN9'
        )
      ).toEqual(
        '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1038\\cocoasubrtf320\n{\\fonttbl\\f0\\fswiss\\fcharset0 Impact;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\qc\\pardirnatural\n\n\\f0\\fs120 \\cf1 \\outl0\\strokewidth-40 \\strokec0 We bow our hearts we bend our knees\\\nOh Spirit come make us humble\\\nWe turn our eyes from evil things\\\nOh Lord we cast down our idols}'
      );
    });

    it('should base64Encode simple strings', () => {
      expect(service.encode('hello world')).toEqual('aGVsbG8gd29ybGQ=');
    });

    it('should base64Encode RTF strings', () => {
      expect(
        service.encode(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1038\\cocoasubrtf320\n{\\fonttbl\\f0\\fswiss\\fcharset0 Impact;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\qc\\pardirnatural\n\n\\f0\\fs120 \\cf1 \\outl0\\strokewidth-40 \\strokec0 We bow our hearts we bend our knees\\\nOh Spirit come make us humble\\\nWe turn our eyes from evil things\\\nOh Lord we cast down our idols}'
        )
      ).toEqual(
        'e1xydGYxXGFuc2lcYW5zaWNwZzEyNTJcY29jb2FydGYxMDM4XGNvY29hc3VicnRmMzIwCntcZm9udHRibFxmMFxmc3dpc3NcZmNoYXJzZXQwIEltcGFjdDt9CntcY29sb3J0Ymw7XHJlZDI1NVxncmVlbjI1NVxibHVlMjU1O30KXHBhcmRcdHg1NjBcdHgxMTIwXHR4MTY4MFx0eDIyNDBcdHgyODAwXHR4MzM2MFx0eDM5MjBcdHg0NDgwXHR4NTA0MFx0eDU2MDBcdHg2MTYwXHR4NjcyMFxxY1xwYXJkaXJuYXR1cmFsCgpcZjBcZnMxMjAgXGNmMSBcb3V0bDBcc3Ryb2tld2lkdGgtNDAgXHN0cm9rZWMwIFdlIGJvdyBvdXIgaGVhcnRzIHdlIGJlbmQgb3VyIGtuZWVzXApPaCBTcGlyaXQgY29tZSBtYWtlIHVzIGh1bWJsZVwKV2UgdHVybiBvdXIgZXllcyBmcm9tIGV2aWwgdGhpbmdzXApPaCBMb3JkIHdlIGNhc3QgZG93biBvdXIgaWRvbHN9'
      );
    });
  });

  describe('RTF', () => {
    it('should get single line plain text from an RTF string', () => {
      expect(
        service.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1343\\cocoasubrtf140\n\\cocoascreenfonts1{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\pardirnatural\\qc\n\n\\f0\\fs260 \\cf1 \\expnd0\\expndtw0\\kerning0\n\\outl0\\strokewidth0 \\strokec0 Our Good }'
        )
      ).toEqual(`Our Good`);
    });

    it('should get multiline plain text from an RTF string 1', () => {
      expect(
        service.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1038\\cocoasubrtf320\n{\\fonttbl\\f0\\fswiss\\fcharset0 Impact;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\qc\\pardirnatural\n\n\\f0\\fs120 \\cf1 \\outl0\\strokewidth-40 \\strokec0 We bow our hearts we bend our knees\\\nOh Spirit come make us humble\\\nWe turn our eyes from evil things\\\nOh Lord we cast down our idols}'
        )
      ).toEqual(dedent`We bow our hearts we bend our knees
                       Oh Spirit come make us humble
                       We turn our eyes from evil things
                       Oh Lord we cast down our idols`);
    });

    it('should get multiline plain text from an RTF string 2', () => {
      expect(
        service.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1343\\cocoasubrtf140\n\\cocoascreenfonts1{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\pardirnatural\\qc\n\n\\f0\\fs260 \\cf1 \\outl0\\strokewidth0 \\strokec1 Give us clean hands\\\nGive us pure hearts\\\nLet us not lift our\\\nSouls to another}'
        )
      ).toEqual(dedent`Give us clean hands
                       Give us pure hearts
                       Let us not lift our
                       Souls to another`);
    });
  });
});
