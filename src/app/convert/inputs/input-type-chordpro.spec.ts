import { TestUtils } from 'test/test-utils';

import { mockStaticTimestamp } from '../../../../test/mock-song-objects';
import { version } from '../../version';
import { InputTypeChordPro } from './input-type-chordpro';

describe('InputTypeChordPro', () => {
  let inputConverter: InputTypeChordPro;

  beforeEach(() => {
    inputConverter = new InputTypeChordPro();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    //Possible file extensions for ChordPro described on this page: https://www.chordpro.org/chordpro/chordpro-introduction/
    it('should properly accept a ChordPro file with a .cho extension', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(true);
    });

    it('should properly accept a ChordPro file with a .crd extension', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'crd';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(true);
    });
    it('should properly accept a ChordPro file with a .chopro extension', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'chopro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(true);
    });
    it('should properly accept a ChordPro file with a .chord extension', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'chord';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(true);
    });

    it('should properly accept a ChordPro file with a .pro extension', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'pro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(true);
    });

    it('should properly reject a ProPresenter file with a .pro extension', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v7-At-the-Cross.pro');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(false);
    });

    it('should properly reject a plain text file', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('Plain-Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(false);
    });

    it('should properly reject a JSON file', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(false);
    });

    it('should properly reject a ProPresenter 4 file', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v4-empty.pro4');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(false);
    });

    it('should properly reject a ProPresenter 5 file', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5-empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBe(false);
    });
  });

  describe('extractSongData()', () => {
    it('should return a song for "simple" test file', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        outputFileName: testFile.name,
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'This is a title',
        info: [
          { name: 'artist', value: 'Hymn' },
          { name: 'key', value: 'E' },
        ],
        slides: [{ title: 'Verse 1', lyrics: `I know a place\nA wonderful place` }],
      });
    });

    it('should return a song for "At the Cross"', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'At-the-Cross.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        outputFileName: testFile.name,
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'At the Cross',
        info: [
          {
            name: 'artist',
            value: 'Hymn',
          },
          {
            name: 'key',
            value: 'E',
          },
          {
            name: 'comment',
            value: 'Words and Music by Randy & Terry Butler',
          },
          {
            name: 'comment',
            value: '(c)1993 Mercy Publishing',
          },
        ],
        slides: [
          {
            title: 'Verse',
            lyrics: `I know a place\nA wonderful place\nWhere accused and condemned\nFind mercy and grace\nWhere the wrongs we have done\nAnd the wrongs done to us\nWere nailed there with him\nThere on the cross`,
          },
          {
            title: 'Chorus',
            lyrics: `At the cross \nHe died for our sins\nAt the cross \nHe gave us life again`,
          },
        ],
      });
    });

    it('should return a song for "Our Father"', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Our-Father.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        outputFileName: testFile.name,
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Our Father',
        info: [
          {
            name: 'artist',
            value: 'Bethel Music',
          },
          {
            name: 'key',
            value: 'G',
          },
          {
            name: 'comment',
            value: 'Words and Music by Marcus Meier',
          },
        ],
        slides: [
          {
            title: 'Verse',
            lyrics: TestUtils.dedent`Our Father in Heaven
                                     Hallowed be Your name
                                     Your Kingdom come quickly
                                     Your will be done the same`,
          },
          {
            title: 'Chorus',
            lyrics: TestUtils.dedent`On Earth as it is in Heaven
                                     Let Heaven come to
                                     Earth as it is in Heaven
                                     Let Heaven come`,
          },
          {
            title: 'Bridge 1',
            lyrics: TestUtils.dedent`Let Heaven come, let Heaven come
                                     Let Heaven come, let Heaven come`,
          },
          {
            title: 'Bridge 2',
            lyrics: TestUtils.dedent`Yours is the Kingdom, Yours is the power
                                     Yours is the glory forever, amen
                                     Yours is the Kingdom, Yours is the power
                                     Yours is the glory forever amen`,
          },
        ],
      });
    });

    it('should return a song for "Swing Low Sweet Chariot"', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Swing-Low-Sweet-Chariot.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        outputFileName: testFile.name,
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Swing Low Sweet Chariot',
        info: [],
        slides: [
          {
            title: 'Chorus',
            lyrics: TestUtils.dedent`Swing low, sweet chariot,
                                     Comin’ for to carry me home.
                                     Swing low, sweet chariot,
                                     Comin’ for to carry me home.`,
          },
          {
            title: 'Verse',
            lyrics: TestUtils.dedent`I looked over Jordan, and what did I see,
                                     Comin’ for to carry me home.
                                     A band of angels comin’ after me,
                                     Comin’ for to carry me home.`,
          },
        ],
      });
    });

    it('should return a song for test file 4 that only uses unlabeled paired directives for "Our Father - unlabeled paired directives"', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Our-Father-unlabeled-paired-directives.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        outputFileName: testFile.name,
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Our Father',
        info: [
          {
            name: 'artist',
            value: 'Bethel Music',
          },
          {
            name: 'key',
            value: 'G',
          },
          {
            name: 'comment',
            value: 'Words and Music by Marcus Meier',
          },
        ],
        slides: [
          {
            title: 'Verse',
            lyrics: TestUtils.dedent`Our Father in Heaven
                                     Hallowed be Your name
                                     Your Kingdom come quickly
                                     Your will be done the same`,
          },
          {
            title: 'Chorus',
            lyrics: TestUtils.dedent`On Earth as it is in Heaven
                                     Let Heaven come to
                                     Earth as it is in Heaven
                                     Let Heaven come`,
          },
          {
            title: 'Bridge',
            lyrics: TestUtils.dedent`Let Heaven come, let Heaven come
                                     Let Heaven come, let Heaven come`,
          },
          {
            title: 'Verse',
            lyrics: TestUtils.dedent`Our Father in Heaven
                                     Hallowed be Your name
                                     Your Kingdom come quickly
                                     Your will be done the same`,
          },
          {
            title: 'Chorus',
            lyrics: TestUtils.dedent`On Earth as it is in Heaven
                                     Let Heaven come to
                                     Earth as it is in Heaven
                                     Let Heaven come`,
          },
          {
            title: 'Bridge',
            lyrics: TestUtils.dedent`Let Heaven come, let Heaven come
                                     Let Heaven come, let Heaven come`,
          },
        ],
      });
    });

    it('should return a song for test file 5 that only uses paired directives with internal labels for "Our Father - directives with internal inline labels"', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Our-Father-directives-with-internal-inline-labels.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        outputFileName: testFile.name,
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Our Father',
        info: [
          { name: 'artist', value: 'Bethel Music' },
          { name: 'key', value: 'G' },
          { name: 'comment', value: 'Words and Music by Marcus Meier' },
        ],
        slides: [
          {
            title: 'Verse 1',
            lyrics: TestUtils.dedent`Our Father in Heaven
                                     Hallowed be Your name
                                     Your Kingdom come quickly
                                     Your will be done the same`,
          },
          {
            title: 'Chorus 1',
            lyrics: TestUtils.dedent`On Earth as it is in Heaven
                                     Let Heaven come to
                                     Earth as it is in Heaven
                                     Let Heaven come`,
          },
          {
            title: 'Bridge 1',
            lyrics: TestUtils.dedent`Let Heaven come, let Heaven come
                                     Let Heaven come, let Heaven come`,
          },
          {
            title: 'Verse 2',
            lyrics: TestUtils.dedent`Our Father in Heaven
                                     Hallowed be Your name
                                     Your Kingdom come quickly
                                     Your will be done the same`,
          },
          {
            title: 'Chorus 2',
            lyrics: TestUtils.dedent`On Earth as it is in Heaven
                                     Let Heaven come to
                                     Earth as it is in Heaven
                                     Let Heaven come`,
          },
          {
            title: 'Bridge 2',
            lyrics: TestUtils.dedent`Let Heaven come, let Heaven come
                                     Let Heaven come, let Heaven come`,
          },
        ],
      });
    });

    it('should return a song for test file 6 that only uses paired directives with internal labels for "Our Father - complex tags"', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Our-Father-complex-tags.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        outputFileName: testFile.name,
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Our Father',
        info: [
          { name: 'artist', value: 'Bethel Music' },
          { name: 'key', value: 'G' },
          { name: 'comment', value: 'Words and Music by Marcus Meier' },
        ],
        slides: [
          {
            title: 'Verse',
            lyrics: TestUtils.dedent`Our Father in Heaven
                                     Hallowed be Your name
                                     Your Kingdom come quickly
                                     Your will be done the same`,
          },
          {
            title: 'Chorus',
            lyrics: TestUtils.dedent`On Earth as it is in Heaven
                                     Let Heaven come to
                                     Earth as it is in Heaven
                                     Let Heaven come`,
          },
          {
            title: 'Bridge 1',
            lyrics: TestUtils.dedent`Let Heaven come, let Heaven come
                                     Let Heaven come, let Heaven come`,
          },
          {
            title: 'Bridge 2',
            lyrics: TestUtils.dedent`Yours is the Kingdom, Yours is the power
                                     Yours is the glory forever, amen
                                     Yours is the Kingdom, Yours is the power
                                     Yours is the glory forever amen`,
          },
        ],
      });
    });

    it('should use the filename as a fallback title when the song has no title for "simple"', () => {
      const testFile = TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.dataAsString = testFile.dataAsString.replace('{title: This is a title}', '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });
  });
});
