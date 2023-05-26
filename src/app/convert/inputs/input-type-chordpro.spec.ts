import {
  mockEmptyJsonFile,
  mockSimpleChordProFile,
  mockEmptyTextFile,
  mockEmptyProPresenter5File,
  mockEmptyProPresenter4File,
} from 'test/mock-raw-files';
import { IRawDataFile } from '../models/file.model';
import { InputTypeChordPro } from './input-type-chordpro';
import {
  mockChordProFile1,
  mockChordProFile2,
  mockChordProFile3,
  mockChordProFile4DirectivesWithoutLabels,
  mockChordProFile5DirectivesWithInlineLabels,
} from 'test/mock-chordpro-files';
import { TestUtils } from 'test/test-utils';

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
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly accept a ChordPro file with a .crd extension', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      testFile.ext = 'crd';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });
    it('should properly accept a ChordPro file with a .chopro extension', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      testFile.ext = 'chopro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });
    it('should properly accept a ChordPro file with a .chord extension', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      testFile.ext = 'chord';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });
    it('should properly accept a ChordPro file with a .pro extension', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      testFile.ext = 'pro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly reject a plain text file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyTextFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject a JSON file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyJsonFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject a ProPresenter 4 file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyProPresenter4File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject a ProPresenter 5 file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyProPresenter5File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should return a song for a simple test file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'This is a title',
        info: [
          {
            name: 'artist',
            value: 'Hymn',
          },
          {
            name: 'key',
            value: 'E',
          },
        ],
        slides: [
          {
            title: 'Verse1',
            lyrics: TestUtils.dedent`I know a place
                                     A wonderful place`,
          },
        ],
      });
    });

    it('should return a song for test file 1', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockChordProFile1);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
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
            lyrics: TestUtils.dedent`I know a place
                                     A wonderful place
                                     Where accused and condemned
                                     Find mercy and grace
                                     Where the wrongs we have done
                                     And the wrongs done to us
                                     Were nailed there with him
                                     There on the cross`,
          },
          {
            title: 'Chorus',
            lyrics: `At the cross \nHe died for our sins\nAt the cross \nHe gave us life again`,
          },
        ],
      });
    });

    it('should return a song for test file 2', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockChordProFile2);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
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

    it('should return a song for test file 3', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockChordProFile3);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
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

    it('should return a song for test file 4 that only uses unlabeled paired directives', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockChordProFile4DirectivesWithoutLabels);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
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

    it('should return a song for test file 5 that only uses paired directives with internal labels', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockChordProFile5DirectivesWithInlineLabels
      );

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
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

    it('should use the filename as a fallback title when the song has no title', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      testFile.data = testFile.data.replace('{title: This is a title}', '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });
  });
});
