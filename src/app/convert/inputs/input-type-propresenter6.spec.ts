import { TestUtils } from 'test/test-utils';

import { mockStaticTimestamp } from '../../../../test/mock-song-objects';
import { version } from '../../version';
import { InputTypeProPresenter6 } from './input-type-propresenter6';

describe('InputTypeProPresenter6', () => {
  let inputConverter: InputTypeProPresenter6;

  beforeEach(() => {
    inputConverter = new InputTypeProPresenter6();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a ProPresenter 6 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v6 - empty.pro6');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ProPresenter 5 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file with a .cho extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file with a .pro extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'pro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should get a TITLE from the file name when the file does not have a CCLISongTitle', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v6 - Be Near.pro6');
      testFile.dataAsString = testFile.dataAsString.replace('CCLISongTitle="Be Near" ', '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });

    it('should get a song from a ProPresenter 6 file1', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v6 - Be Near.pro6');

      const songData = inputConverter.extractSongData(testFile);

      //Skip slides from file 1 b/c it has weird commas in the lyrics. Just an artifact of how it was made. Not great for testing here
      expect(songData.originalFile.name).toEqual(testFile.name);
      expect(songData.title).toEqual('Be Near');
      expect(songData.info).toEqual([
        { name: 'Artist', value: 'Shane Bernard' },
        { name: 'Category', value: 'Song' },
        { name: 'Copyright', value: 2003 },
        { name: 'Publisher', value: 'Waiting Room Music' },
      ]);
    });

    it('should get a song from a ProPresenter 6 file2', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v6 - Amazing Grace.pro6');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Amazing Grace',
        info: [
          { name: 'Artist', value: 'John Newton' },
          { name: 'Category', value: 'Song' },
        ],
        slides: [
          { title: 'Blank', lyrics: '' },
          {
            title: 'Verse 1 (1)',
            lyrics: 'Amazing grace how sweet the sound\r\nThat saved a wretch like me',
          },
          {
            title: 'Verse 1 (2)',
            lyrics: "I once was lost but now I'm found\r\nWas blind but now I see",
          },
          {
            title: 'Verse 2 (1)',
            lyrics: 'Twas grace that taught my heart to fear\r\nAnd grace my fears relieved',
          },
          {
            title: 'Verse 2 (2)',
            lyrics: 'How precious did that grace appear\r\nThe hour I first believed',
          },
          {
            title: 'Verse 3 (1)',
            lyrics: 'Through many dangers, toils\r\nAnd snares I have already come',
          },
          {
            title: 'Verse 3 (2)',
            lyrics: "'Tis grace that brought me safe thus far\r\nAnd grace will lead me home",
          },
          {
            title: 'Verse 4 (1)',
            lyrics: "When we've been there ten thousand years\r\nBright shining as the sun",
          },
          {
            title: 'Verse 4 (2)',
            lyrics: "We've no less days to sing God's praise\r\nThan when we'd first begun!",
          },
        ],
      });
    });

    it('should get a song from a ProPresenter 6 file3', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v6 - Feature Test.pro6');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'v6 - Feature Test',
        info: [{ name: 'Category', value: 'Song' }],
        slides: [
          { title: 'Blank', lyrics: '' },
          { title: ' (1)', lyrics: 'two\none' },
          { title: ' (2)', lyrics: 'Lower 3rd text\nOther text in lower 3rd' },
          { title: ' (3)', lyrics: 'Double-click to edit' },
          { title: 'Tag', lyrics: 'Double-click to edit' },
        ],
      });
    });

    it('should get a song from a ProPresenter 6 file2 when a slide has no title but lyrics', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v6 - single-unnamed-slide.pro6');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'v6 - single-unnamed-slide',
        info: [{ name: 'Category', value: 'Song' }],
        slides: [{ title: '', lyrics: 'two' }],
      });
    });
  });
});
