import {
  mockEmptySongProFile,
  mockEmptyTextFile,
  mockSimpleChordProFile,
} from 'test/mock-raw-files';
import { TestUtils } from 'test/test-utils';
import { IRawDataFile } from '../models/file.model';
import { InputTypeSongPro } from './input-type-songpro';
import { mockSongProFile1 } from 'test/mock-songpro-files';

describe('InputTypeSongPro', () => {
  let inputConverter: InputTypeSongPro;

  beforeEach(() => {
    inputConverter = new InputTypeSongPro();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a SongPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptySongProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
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

  describe('extractSongData()', () => {
    it('should return a song for a SongPro file1', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongProFile1);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: '',
        info: [],
        slides: []
      });
    });

    // xit('should use the filename as the title when a title is not present in the file', () => {
    //   const testFile: IRawDataFile = TestUtils.deepClone(mockPlainTextFile2);
    //   testFile.name = 'My Test Title';
    //   testFile.data = testFile.data.replace(/^title:.+/i, '');
    //   expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    // });
  });
});
