import { Utils } from './utils';

describe('Utils', () => {
  describe('mergeArraysByProp()', () => {
    it('should only combine arrays of objects together when all values of the same key are unique', () => {
      const obj1 = [{ foo: 'fooVal' }];
      const obj2 = [{ foo: 'barVal' }];
      expect(Utils.mergeArraysByProp(obj1, obj2, 'foo')).toEqual([{ foo: 'fooVal' }, { foo: 'barVal' }]);
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
      expect(Utils.normalizeLineEndings('\n\r\n\r')).withContext('\\n\\r\\n\\r => \\n\\n').toEqual('\n\n');
      expect(Utils.normalizeLineEndings('\r\n\r\n')).withContext('\\r\\n\\r\\n => \\n\\n').toEqual('\n\n');

      //No chages expected here
      expect(Utils.normalizeLineEndings('\n')).withContext('\\n => \\n').toEqual('\n');
      expect(Utils.normalizeLineEndings('\n\n')).withContext('\\n\\n => \\n\\n').toEqual('\n\n');
    });
  });
});
