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

  fdescribe('extractSongData()', () => {
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
        info: [],
        slides: [],
      });
    });
  });
});
