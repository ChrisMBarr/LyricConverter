import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeProPresenter6 } from './input-type-propresenter6';
import { TestUtils } from 'test/test-utils';
import {
  mockEmptyJsonFile,
  mockEmptyProPresenter5File,
  mockSimpleChordProFile,
  mockEmptyTextFile,
  mockEmptyProPresenter6File,
} from 'test/mock-raw-files';
import * as mockPpFiles from 'test/mock-propresenter-files';

describe('InputTypeProPresenter6', () => {
  let inputConverter: InputTypeProPresenter6;

  beforeEach(() => {
    inputConverter = new InputTypeProPresenter6();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a ProPresenter 6 file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyProPresenter6File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ProPresenter 6 file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyProPresenter5File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyJsonFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyTextFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file with a .cho extension', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file with a .pro extension', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      testFile.ext = 'pro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should get the expected TITLES from ProPresenter 6 files', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp6File1).title).toEqual('Be Near');
      expect(inputConverter.extractSongData(mockPpFiles.pp6File2).title).toEqual('Amazing Grace');
    });

    it('should get a TITLE from the file name when the file does not have a CCLISongTitle', () => {
      const fileCopy = TestUtils.deepClone(mockPpFiles.pp6File1);
      fileCopy.data = fileCopy.data.replace('CCLISongTitle="Be Near" ', '');
      expect(inputConverter.extractSongData(fileCopy).title).toEqual(fileCopy.name);
    });

    it('should get the expected INFO from a ProPresenter 6 file1', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp6File1).info).toEqual([
        { name: 'Artist', value: 'Shane Bernard' },
        { name: 'Category', value: 'Song' },
        { name: 'Copyright', value: 2003 },
        { name: 'Publisher', value: 'Waiting Room Music' },
      ]);
    });

    it('should get the expected INFO from a ProPresenter 6 file2', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp6File2).info).toEqual([
        { name: 'Artist', value: 'John Newton' },
        { name: 'Category', value: 'Song' },
      ]);
    });

    //Skip slide form file 1 b/c it has weird commas in the lyrics. Just an artifact of how it was made. Not great for testing here
    it('should get the expected SLIDES from a ProPresenter 6 file2', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp6File2).slides).toEqual([
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
      ]);
    });

    it('should get the expected SLIDES from a ProPresenter 6 file3', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp6File3).slides).toEqual([
        { title: 'Blank', lyrics: '' },
        { title: ' (1)', lyrics: 'two\none' },
        { title: ' (2)', lyrics: 'Lower 3rd text\nOther text in lower 3rd' },
        { title: ' (3)', lyrics: 'Double-click to edit' },
        { title: 'Tag', lyrics: 'Double-click to edit' },
      ]);
    });

    it('should get the expected SLIDES from a ProPresenter 6 file2 when a slide has no title but lyrics', () => {
      expect(
        inputConverter.extractSongData(mockPpFiles.pp6File4OneSlideWithLyricsAndNoName).slides
      ).toEqual([
        {
          title: '',
          lyrics: 'two',
        },
      ]);
    });
  });
});
