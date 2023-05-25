import { TestUtils } from 'test/test-utils';
import { Utils } from './utils';

describe('Utils', () => {
  describe('Base64 Encode/Decode', () => {
    it('should base64Decode simple strings', () => {
      expect(Utils.decodeBase64('aGVsbG8gd29ybGQ=')).toEqual('hello world');
    });

    it('should base64Decode RTF strings', () => {
      expect(
        Utils.decodeBase64(
          'e1xydGYxXGFuc2lcYW5zaWNwZzEyNTJcY29jb2FydGYxMDM4XGNvY29hc3VicnRmMzIwCntcZm9udHRibFxmMFxmc3dpc3NcZmNoYXJzZXQwIEltcGFjdDt9CntcY29sb3J0Ymw7XHJlZDI1NVxncmVlbjI1NVxibHVlMjU1O30KXHBhcmRcdHg1NjBcdHgxMTIwXHR4MTY4MFx0eDIyNDBcdHgyODAwXHR4MzM2MFx0eDM5MjBcdHg0NDgwXHR4NTA0MFx0eDU2MDBcdHg2MTYwXHR4NjcyMFxxY1xwYXJkaXJuYXR1cmFsCgpcZjBcZnMxMjAgXGNmMSBcb3V0bDBcc3Ryb2tld2lkdGgtNDAgXHN0cm9rZWMwIFdlIGJvdyBvdXIgaGVhcnRzIHdlIGJlbmQgb3VyIGtuZWVzXApPaCBTcGlyaXQgY29tZSBtYWtlIHVzIGh1bWJsZVwKV2UgdHVybiBvdXIgZXllcyBmcm9tIGV2aWwgdGhpbmdzXApPaCBMb3JkIHdlIGNhc3QgZG93biBvdXIgaWRvbHN9'
        )
      ).toEqual(
        '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1038\\cocoasubrtf320\n{\\fonttbl\\f0\\fswiss\\fcharset0 Impact;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\qc\\pardirnatural\n\n\\f0\\fs120 \\cf1 \\outl0\\strokewidth-40 \\strokec0 We bow our hearts we bend our knees\\\nOh Spirit come make us humble\\\nWe turn our eyes from evil things\\\nOh Lord we cast down our idols}'
      );
    });

    it('should base64Encode simple strings', () => {
      expect(Utils.encodeBase64('hello world')).toEqual('aGVsbG8gd29ybGQ=');
    });

    it('should base64Encode RTF strings', () => {
      expect(
        Utils.encodeBase64(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1038\\cocoasubrtf320\n{\\fonttbl\\f0\\fswiss\\fcharset0 Impact;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\qc\\pardirnatural\n\n\\f0\\fs120 \\cf1 \\outl0\\strokewidth-40 \\strokec0 We bow our hearts we bend our knees\\\nOh Spirit come make us humble\\\nWe turn our eyes from evil things\\\nOh Lord we cast down our idols}'
        )
      ).toEqual(
        'e1xydGYxXGFuc2lcYW5zaWNwZzEyNTJcY29jb2FydGYxMDM4XGNvY29hc3VicnRmMzIwCntcZm9udHRibFxmMFxmc3dpc3NcZmNoYXJzZXQwIEltcGFjdDt9CntcY29sb3J0Ymw7XHJlZDI1NVxncmVlbjI1NVxibHVlMjU1O30KXHBhcmRcdHg1NjBcdHgxMTIwXHR4MTY4MFx0eDIyNDBcdHgyODAwXHR4MzM2MFx0eDM5MjBcdHg0NDgwXHR4NTA0MFx0eDU2MDBcdHg2MTYwXHR4NjcyMFxxY1xwYXJkaXJuYXR1cmFsCgpcZjBcZnMxMjAgXGNmMSBcb3V0bDBcc3Ryb2tld2lkdGgtNDAgXHN0cm9rZWMwIFdlIGJvdyBvdXIgaGVhcnRzIHdlIGJlbmQgb3VyIGtuZWVzXApPaCBTcGlyaXQgY29tZSBtYWtlIHVzIGh1bWJsZVwKV2UgdHVybiBvdXIgZXllcyBmcm9tIGV2aWwgdGhpbmdzXApPaCBMb3JkIHdlIGNhc3QgZG93biBvdXIgaWRvbHN9'
      );
    });
  });

  describe('stripRtf()', () => {
    it('should get single line plain text from an RTF string', () => {
      expect(
        Utils.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1343\\cocoasubrtf140\n\\cocoascreenfonts1{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\pardirnatural\\qc\n\n\\f0\\fs260 \\cf1 \\expnd0\\expndtw0\\kerning0\n\\outl0\\strokewidth0 \\strokec0 Our Good }'
        )
      ).toEqual(`Our Good`);
    });

    it('should get multiline plain text from an RTF string 1', () => {
      expect(
        Utils.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1038\\cocoasubrtf320\n{\\fonttbl\\f0\\fswiss\\fcharset0 Impact;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\qc\\pardirnatural\n\n\\f0\\fs120 \\cf1 \\outl0\\strokewidth-40 \\strokec0 We bow our hearts we bend our knees\\\nOh Spirit come make us humble\\\nWe turn our eyes from evil things\\\nOh Lord we cast down our idols}'
        )
      ).toEqual(TestUtils.dedent`We bow our hearts we bend our knees
                       Oh Spirit come make us humble
                       We turn our eyes from evil things
                       Oh Lord we cast down our idols`);
    });

    it('should get multiline plain text from an RTF string 2', () => {
      expect(
        Utils.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1343\\cocoasubrtf140\n\\cocoascreenfonts1{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\pardirnatural\\qc\n\n\\f0\\fs260 \\cf1 \\outl0\\strokewidth0 \\strokec1 Give us clean hands\\\nGive us pure hearts\\\nLet us not lift our\\\nSouls to another}'
        )
      ).toEqual(TestUtils.dedent`Give us clean hands
                       Give us pure hearts
                       Let us not lift our
                       Souls to another`);
    });
  });

  describe('mergeArraysByProp()', () => {
    it('should only combine arrays of objects together when all values of the same key are unique', () => {
      const obj1 = [{ foo: 'fooVal' }];
      const obj2 = [{ foo: 'barVal' }];
      expect(Utils.mergeArraysByProp(obj1, obj2, 'foo')).toEqual([
        { foo: 'fooVal' },
        { foo: 'barVal' },
      ]);
    });

    it('should merge identical arrays of objects together, overwriting values for the same key', () => {
      const obj1 = [{ foo: 'fooVal' }];
      const obj2 = [{ foo: 'fooVal' }];
      expect(Utils.mergeArraysByProp(obj1, obj2, 'foo')).toEqual([{ foo: 'fooVal' }]);
    });

    it('should merge different arrays of objects together, overwriting values for the same key', () => {
      const obj1 = [
        { foo: 'fooVal1', other: 'originalValue' },
        { foo: 'fooVal2', other: 'newValue1' },
        { foo: 'fooVal3', other: 'newValue2' },
      ];
      const obj2 = [{ foo: 'fooVal2', other: 'MyOverwrittenValue' }];

      expect(Utils.mergeArraysByProp(obj1, obj2, 'foo')).toEqual([
        { foo: 'fooVal1', other: 'originalValue' },
        { foo: 'fooVal3', other: 'newValue2' },
        { foo: 'fooVal2', other: 'MyOverwrittenValue' },
      ]);
    });
  });

  describe('normalizeLineEndings()', () => {
    it('should replace all line ending combinations with \\n', () => {
      //Single instances
      expect(Utils.normalizeLineEndings('\n\r')).withContext('\\n\\r => \\n').toEqual('\n');
      expect(Utils.normalizeLineEndings('\r\n')).withContext('\\r\\n => \\n').toEqual('\n');

      //Multiple instances
      expect(Utils.normalizeLineEndings('\n\r\n\r'))
        .withContext('\\n\\r\\n\\r => \\n\\n')
        .toEqual('\n\n');
      expect(Utils.normalizeLineEndings('\r\n\r\n'))
        .withContext('\\r\\n\\r\\n => \\n\\n')
        .toEqual('\n\n');

      //No chages expected here
      expect(Utils.normalizeLineEndings('\n')).withContext('\\n => \\n').toEqual('\n');
      expect(Utils.normalizeLineEndings('\n\n')).withContext('\\n\\n => \\n\\n').toEqual('\n\n');
    });
  });
});
