import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypePlainText } from './input-type-plain-text';
import { TestUtils } from 'test/test-utils';
import {
  mockEmptyJsonFile,
  mockEmptyProPresenter5File,
  mockSimpleChordProFile,
  mockEmptyTextFile,
} from 'test/mock-raw-files';
import { mockPlainTextFile1, mockPlainTextFile2 } from 'test/mock-plain-text-files';
import { LyricConverterError } from '../models/errors.model';

describe('InputTypePlainText', () => {
  let inputConverter: InputTypePlainText;

  beforeEach(() => {
    inputConverter = new InputTypePlainText();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a plain text file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyTextFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ChordPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyJsonFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyProPresenter5File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should throw an error if there are not enough blank lines to tell the info apart form the lyrics', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockPlainTextFile1);
      testFile.data = testFile.data.replace('\n\n\n', '\n');

      const expectedError = new LyricConverterError(
        `This Plain Text file is not formatted correctly. It needs to have 2 blank lines between the info at the top and the lyrics so they can be differentiated.`
      );
      expect(() => inputConverter.extractSongData(testFile)).toThrow(expectedError);
    });

    it('should return a song for a plain text file1', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockPlainTextFile1);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Your Grace is Enough',
        info: [
          {
            name: 'CCLI Number',
            value: '1234',
          },
          {
            name: 'artist',
            value: 'Bethel Music',
          },
          {
            name: 'key',
            value: 'G',
          },
        ],
        slides: [
          {
            title: 'Chorus',
            lyrics: TestUtils.dedent`Your grace is enough
                                     Your grace is enough
                                     Your grace is enough for me`,
          },
          {
            title: 'Verse 1',
            lyrics: TestUtils.dedent`Great is your faithfulness O God
                                     You wrestle with the sinners heart
                                     You lead us by still waters and to mercy
                                     And nothing can keep us apart`,
          },
          {
            title: 'Verse 2',
            lyrics: TestUtils.dedent`Great is your love and justice God
                                     You use the weak to lead the strong
                                     You lead us in the song of your salvation
                                     And all your people sing along`,
          },
        ],
      });
    });

    it('should return a song for a plain text file2', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockPlainTextFile2);

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
            lyrics: TestUtils.dedent`At the cross
                                     He died for our sins
                                     At the cross
                                     He gave us life again`,
          },
        ],
      });
    });

    it('should use the filename as the title when a title is not present in the file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockPlainTextFile2);
      testFile.name = 'My Test Title';
      testFile.data = testFile.data.replace(/^title:.+/i, '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });
  });
});
