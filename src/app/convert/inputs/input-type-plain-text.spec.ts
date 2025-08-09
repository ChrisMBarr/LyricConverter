import { TestUtils } from 'test/test-utils';

import { mockStaticTimestamp } from '../../../../test/mock-song-objects';
import { version } from '../../version';
import { LyricConverterError } from '../models/errors.model';
import { InputTypePlainText } from './input-type-plain-text';

describe('InputTypePlainText', () => {
  let inputConverter: InputTypePlainText;

  beforeEach(() => {
    inputConverter = new InputTypePlainText();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a plain text file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain-Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ChordPro file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5-empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should throw an error if there are not enough blank lines to tell the info apart form the lyrics', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain-Text', 'Your-Grace-is-Enough.txt');
      testFile.dataAsString = testFile.dataAsString.replace(
        `

`,
        `
`,
      );

      // console.log(testFile.dataAsString, testFile.dataAsString.charAt(73));

      const expectedError = new LyricConverterError(
        `This Plain-Text file is not formatted correctly. It needs to have 2 blank lines between the info at the top and the lyrics so they can be differentiated.`,
      );
      expect(() => inputConverter.extractSongData(testFile)).toThrow(expectedError);
    });

    it('should return a song for a plain text file1', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain-Text', 'Your-Grace-is-Enough.txt');

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
        title: 'Your Grace is Enough',
        info: [
          { name: 'CCLI Number', value: '1234' },
          { name: 'artist', value: 'Bethel Music' },
          { name: 'key', value: 'G' },
        ],
        slides: [
          { title: 'Chorus', lyrics: `Your grace is enough\nYour grace is enough\nYour grace is enough for me` },
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
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain-Text', 'At-the-Cross.txt');

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
          { name: 'artist', value: 'Hymn' },
          { name: 'key', value: 'E' },
          { name: 'comment', value: 'Words and Music by Randy & Terry Butler' },
          { name: 'comment', value: '(c)1993 Mercy Publishing' },
        ],
        slides: [
          {
            title: 'Verse',
            lyrics: `I know a place\nA wonderful place\nWhere accused and condemned\nFind mercy and grace\nWhere the wrongs we have done\nAnd the wrongs done to us\nWere nailed there with him\nThere on the cross`,
          },
          { title: 'Chorus', lyrics: `At the cross\nHe died for our sins\nAt the cross\nHe gave us life again` },
        ],
      });
    });

    it('should use the filename as the title when a title is not present in the file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain-Text', 'At-the-Cross.txt');
      testFile.name = 'My Test Title';
      testFile.dataAsString = testFile.dataAsString.replace(/^title:.+/i, '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });
  });
});
