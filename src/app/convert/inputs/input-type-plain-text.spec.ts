import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypePlainText } from './input-type-plain-text';
import { TestUtils } from 'test/test-utils';
import {
  mockEmptyJsonFile,
  mockEmptyProPresenter5File,
  mockSimpleChordProFile,
  mockEmptyTextFile,
} from 'test/mock-raw-files';
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
      const testFile: IRawDataFile = structuredClone(mockEmptyTextFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ChordPro file when tested', () => {
      const testFile: IRawDataFile = structuredClone(mockSimpleChordProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file when tested', () => {
      const testFile: IRawDataFile = structuredClone(mockEmptyJsonFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter file when tested', () => {
      const testFile: IRawDataFile = structuredClone(mockEmptyProPresenter5File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should throw an error if there are not enough blank lines to tell the info apart form the lyrics', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'Your Grace is Enough.txt');
      testFile.dataAsString = testFile.dataAsString.replace('\r\n\r\n\r\n', '\r\n');

      const expectedError = new LyricConverterError(
        `This Plain Text file is not formatted correctly. It needs to have 2 blank lines between the info at the top and the lyrics so they can be differentiated.`
      );
      expect(() => inputConverter.extractSongData(testFile)).toThrow(expectedError);
    });

    it('should return a song for a plain text file1', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'Your Grace is Enough.txt');

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
            lyrics: `Your grace is enough\nYour grace is enough\nYour grace is enough for me`,
          },
          {
            title: 'Verse 1',
            lyrics: `Great is your faithfulness O God\nYou wrestle with the sinners heart\nYou lead us by still waters and to mercy\nAnd nothing can keep us apart`,
          },
          {
            title: 'Verse 2',
            lyrics: `Great is your love and justice God\nYou use the weak to lead the strong\nYou lead us in the song of your salvation\nAnd all your people sing along`,
          },
        ],
      });
    });

    it('should return a song for a plain text file2', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'At the Cross.txt');

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
            lyrics: `I know a place\nA wonderful place\nWhere accused and condemned\nFind mercy and grace\nWhere the wrongs we have done\nAnd the wrongs done to us\nWere nailed there with him\nThere on the cross`,
          },
          {
            title: 'Chorus',
            lyrics: `At the cross\nHe died for our sins\nAt the cross\nHe gave us life again`,
          },
        ],
      });
    });

    it('should use the filename as the title when a title is not present in the file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'At the Cross.txt');
      testFile.name = 'My Test Title';
      testFile.dataAsString = testFile.dataAsString.replace(/^title:.+/i, '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });
  });
});
