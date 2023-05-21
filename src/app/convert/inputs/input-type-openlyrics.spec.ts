import { TestUtils } from 'test/test-utils';
import { IRawDataFile } from '../models/file.model';
import { InputTypeOpenLyrics } from './input-type-openlyrics';
import * as mockOpenLyrics from 'test/mock-openlyrics-files';
import * as mockRawFiles from 'test/mock-raw-files';

describe('InputTypeOpenLyrics', () => {
  let inputConverter: InputTypeOpenLyrics;

  beforeEach(() => {
    inputConverter = new InputTypeOpenLyrics();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a OpenLyrics XML file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsFileSimpleFile
      );
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a plain text file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockRawFiles.mockEmptyTextFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockRawFiles.mockSimpleChordProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockRawFiles.mockEmptyJsonFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockRawFiles.mockEmptyProPresenter5File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should return a song for a simple OpenLyrics file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsFileSimpleFile
      );

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Amazing Grace',
        info: [],
        slides: [],
      });
    });

    it('should return a song for a complex OpenLyrics file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsFileComplexFile
      );

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Amazing Grace',
        info: [
          {
            name: 'Authors',
            value: 'John Newton, Chris Rice, Richard Wagner, František Foo',
          },
          {
            name: 'Comment',
            value: 'This is one of the most popular songs in our congregation.',
          },
          {
            name: 'Song Book 1',
            value: 'Songbook without Number',
          },
          {
            name: 'Song Book 2',
            value: 'Songbook with Number (entry 48)',
          },
          {
            name: 'Song Book 3',
            value: 'Songbook with Letters in Entry Name (entry 153c)',
          },
          {
            name: 'Tempo',
            value: '90bpm',
          },
          {
            name: 'Themes',
            value: 'Adoration, Grace, Praise, Salvation, Graça, Adoração, Salvação',
          },
          {
            name: 'copyright',
            value: 'public domain',
          },
          {
            name: 'ccliNo',
            value: '4639462',
          },
          {
            name: 'released',
            value: '1779',
          },
          {
            name: 'transposition',
            value: '2',
          },
          {
            name: 'key',
            value: 'C#',
          },
          {
            name: 'variant',
            value: 'Newsboys',
          },
          {
            name: 'publisher',
            value: 'Sparrow Records',
          },
          {
            name: 'keywords',
            value: 'something to help with more accurate results',
          },
          {
            name: 'verseOrder',
            value: 'v1 v2  v3 c v4 c1 c2 b b1 b2',
          },
        ],
        slides: [],
      });
    });

    it('should use the filename for the title if there is no title', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsFileSimpleFile
      );

      //remove the titles so the parser can't find one
      testFile.data = testFile.data.replace(/<titles>[\W\w]+?<\/titles>/, '');

      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });
  });
});
