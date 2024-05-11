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
    it('should properly accept a ChordPro file with a .cho extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly accept a ChordPro file with a .crd extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'crd';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });
    it('should properly accept a ChordPro file with a .chopro extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'chopro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });
    it('should properly accept a ChordPro file with a .chord extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'chord';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly accept a ChordPro file with a .pro extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'pro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly reject a ProPresenter file with a .pro extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v7-At the Cross.pro');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject a plain text file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject a JSON file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject a ProPresenter 4 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v4 - empty.pro4');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject a ProPresenter 5 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should return a song for "simple" test file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
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

    it('should return a song for "At the Cross"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'At the Cross.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
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

    it('should return a song for "Our Father"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Our Father.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
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

    it('should return a song for "Swing Low Sweet Chariot"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Swing Low Sweet Chariot.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
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

    it('should return a song for test file 4 that only uses unlabeled paired directives for "Our Father - unlabeled paired directives"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Our Father - unlabeled paired directives.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
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

    it('should return a song for test file 5 that only uses paired directives with internal labels for "Our Father - directives with internal inline labels"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Our Father - directives with internal inline labels.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
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

    it('should return a song for test file 6 that only uses paired directives with internal labels for "Our Father - complex tags"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'Our Father - complex tags.cho');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
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

    it('should use the filename as a fallback title when the song has no title for "simple"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.dataAsString = testFile.dataAsString.replace('{title: This is a title}', '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });
  });
});
