import { TestUtils } from 'test/test-utils';

import { mockStaticTimestamp } from '../../../../test/mock-song-objects';
import { version } from '../../version';
import { InputTypeMediaShout } from './input-type-mediashout';

fdescribe('InputTypeMediaShout', () => {
  let inputConverter: InputTypeMediaShout;

  beforeEach(() => {
    inputConverter = new InputTypeMediaShout();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a MediaShout file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'The.Blessing.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a plain JSON file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter 5 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should get a song from a "All.Creatures.or.our.God"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'All.Creatures.or.our.God.json');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Hymn 002 - All Creatures of our God',
        info: [{ name: 'Song ID', value: '8bf61074-238e-4704-86ea-5f8443d34e35' }],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              'All creatures of our God and King.\r\nLift up your voice with us and sing:\r\nAlleluia!  Alleluia! O burning sun\r\nwith golden beam\r\nAnd silver moon with softer gleam:',
          },
          {
            title: 'Chorus 1',
            lyrics: 'Oh, praise Him!\r\nOh, praise Him!\r\nAlleluia, alleluia,\r\nalleluia!',
          },
          {
            title: 'Verse 2',
            lyrics:
              'O rushing wind and breezes soft,\r\nO clouds that ride the winds aloft:\r\nO praise Him! Alleluia!\r\nO rising morn, in praise rejoice,\r\nO lights of evening, find a voice.',
          },
          {
            title: 'Verse 3',
            lyrics:
              'O flowing waters, pure and clear,\r\nMake music for your Lord to hear,\r\nO praise Him! Alleluia!\r\nO fire so masterful and bright,\r\nProviding us with warmth and light,',
          },
          {
            title: 'Verse 4',
            lyrics:
              'Let all things their Creator bless,\r\nAnd worship Him in humbleness,\r\nO praise Him! Alleluia!\r\nOh, praise the Father, praise the Son,\r\nAnd praise the Spirit, three in One!',
          },
        ],
      });
    });

    it('should get a song from a "The.Blessing"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'The.Blessing.json');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'The Blessing - Kari Jobe',
        info: [{ name: 'Song ID', value: '23201acf-959a-4e99-af7a-b02ba54c90b1' }],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              'The Lord bless you and keep you\r\nMake His face shine upon you and be gracious to you\r\nThe Lord turn His face toward you\r\nAnd give you peace',
          },
          { title: 'Ending 1', lyrics: `Amen, Amen, Amen\r\nAmen, Amen, Amen` },
        ],
      });
    });

    it('should get a song from a "JOY.is.joy"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'JOY.is.Joy.json');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'JOY is Joy',
        info: [{ name: 'Song ID', value: '200f9c84-0269-4668-b12e-cfe57409e24e' }],
        slides: [
          { title: 'Verse 1', lyrics: 'JOY is joy\r\nJoy in the Holy Ghost\r\nJOY is joy\r\nJoy in the Lord' },
          {
            title: 'Chorus 1',
            lyrics: 'Don’t let nobody spoil your joy\r\nDon’t let nobody spoil your joy\r\nDon’t let nobody spoil your joy,\r\nJoy in the Lord',
          },
          { title: 'Verse 2', lyrics: 'LOVE love\r\nLove in the Holy Ghost\r\nLOVE Love\r\nLove in the Lord' },
          { title: 'Verse 3', lyrics: 'PEACE\r\nPeace in the Holy Ghost\r\nPEACE\r\nPeace in the Lord' },
        ],
      });
    });
  });
});
