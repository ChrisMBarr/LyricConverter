import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeText } from './input-type-text';
import {
  mockEmptyJsonFile,
  mockEmptyProPresenter5File,
  mockSimpleChordProFile,
  mockEmptyTextFile,
} from 'test/mock-raw-files';

describe('InputTypeText', () => {
  let inputConverter: InputTypeText;

  beforeEach(() => {
    inputConverter = new InputTypeText();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a plain text file when tested', () => {
      const testFile: IRawDataFile = { ...mockEmptyTextFile };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ChordPro file when tested', () => {
      const testFile: IRawDataFile = { ...mockSimpleChordProFile };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file when tested', () => {
      const testFile: IRawDataFile = { ...mockEmptyJsonFile };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter file when tested', () => {
      const testFile: IRawDataFile = { ...mockEmptyProPresenter5File };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });
});
