import {
  mockEmptySongShowPlusFile,
  mockEmptySongProFile,
  mockEmptyTextFile,
  mockSimpleChordProFile,
} from 'test/mock-raw-files';
import { TestUtils } from 'test/test-utils';
import { IRawDataFile } from '../models/file.model';
import { InputTypeSongShowPlus7 } from './input-type-songshowplus7';
import { mockSongShowPlusFile1 } from 'test/mock-songshowplus7-files';

describe('InputTypeSongShowPlus7', () => {
  let inputConverter: InputTypeSongShowPlus7;

  beforeEach(() => {
    inputConverter = new InputTypeSongShowPlus7();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a SongPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptySongShowPlusFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a SongPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptySongProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyTextFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  fdescribe('extractSongData()', () => {
    it('should return a song for a SongShow Plus 7 file1', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongShowPlusFile1);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: '',
        info: [],
        slides: []
      });
    });
  });
});
