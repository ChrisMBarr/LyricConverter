import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeProPresenter5 } from './input-type-propresenter5';
import * as mockPpFiles from 'test/mock-propresenter-files';
import { TestUtils } from 'test/test-utils';
import {
  mockEmptyJsonFile,
  mockEmptyProPresenter4File,
  mockEmptyProPresenter5File,
  mockSimpleChordProFile,
  mockEmptyTextFile,
} from 'test/mock-raw-files';

describe('InputTypeProPresenter5', () => {
  let inputConverter: InputTypeProPresenter5;

  beforeEach(() => {
    inputConverter = new InputTypeProPresenter5();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a ProPresenter 5 file', () => {
      const testFile: IRawDataFile = { ...mockEmptyProPresenter5File };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ProPresenter 4 file', () => {
      const testFile: IRawDataFile = { ...mockEmptyProPresenter4File };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file', () => {
      const testFile: IRawDataFile = { ...mockEmptyJsonFile };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file', () => {
      const testFile: IRawDataFile = { ...mockEmptyTextFile };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file with a .cho extension', () => {
      const testFile: IRawDataFile = { ...mockSimpleChordProFile };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file with a .pro extension', () => {
      const testFile: IRawDataFile = { ...mockSimpleChordProFile };
      testFile.ext = 'pro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should get the expected TITLES from ProPresenter 5 files', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp5File1).title).toEqual('Be Near');
      expect(inputConverter.extractSongData(mockPpFiles.pp5File2).title).toEqual(
        'Give Us Clean Hands'
      );
    });

    it('should get a TITLE from the file name when the file does not have a CCLISongTitle', () => {
      const fileCopy = TestUtils.deepClone(mockPpFiles.pp5File1);
      fileCopy.data = fileCopy.data.replace('CCLISongTitle="Be Near" ', '');
      expect(inputConverter.extractSongData(fileCopy).title).toEqual(fileCopy.name);
    });

    it('should get the expected INFO from a ProPresenter 5 file1', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp5File1).info).toEqual([
        { name: 'creatorCode', value: 1349676880 },
        { name: 'category', value: 'Song' },
        { name: 'artist', value: 'Shane Bernard' },
        { name: 'CCLISongTitle', value: 'Be Near' },
        { name: 'CCLIPublisher', value: 'Waiting Room Music' },
        { name: 'CCLICopyrightInfo', value: 2003 },
      ]);
    });

    it('should get the expected INFO from a ProPresenter 5 file2', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp5File2).info).toEqual([
        { name: 'creatorCode', value: 1349676880 },
        { name: 'category', value: 'Song' },
        { name: 'artist', value: 'Charlie Hall' },
        { name: 'author', value: 'Charlie Hall' },
        { name: 'CCLISongTitle', value: 'Give Us Clean Hands' },
        { name: 'CCLICopyrightInfo', value: 2000 },
        { name: 'CCLILicenseNumber', value: 2060208 },
      ]);
    });

    it('should get the expected SLIDES from a ProPresenter 5 file1', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp5File1).slides).toEqual([
        {
          title: 'Background',
          lyrics: '',
        },
        {
          title: 'Verse 1 (1)',
          lyrics: 'You are all\nBig and small\nBeautiful',
        },
        {
          title: 'Verse 1 (2)',
          lyrics: "And wonderful to \nTrust in grace\nThrough faith\nBut I'm asking to taste",
        },
        {
          title: 'Bridge 1',
          lyrics:
            'For dark is light to You\nDepths are Height to you\nFar is near\nBut Lord I need to hear from You',
        },
        {
          title: 'Chorus',
          lyrics: 'Be near O God\nBe near O God of us\nYour nearness is\nTo us our good',
        },
        {
          title: 'Post-Chorus',
          lyrics: 'Our Good',
        },
        {
          title: 'Verse 2 (1)',
          lyrics: 'Your fullness is mine\nRevelation Divine',
        },
        {
          title: 'Verse 2 (2)',
          lyrics: 'But oh to taste\nTo know much\nMore than a page\nTo feel Your embrace',
        },
        {
          title: 'Ending',
          lyrics: 'My Good',
        },
        {
          title: '*blank*',
          lyrics: '',
        },
      ]);
    });

    it('should get the expected SLIDES from a ProPresenter 5 file2', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp5File2).slides).toEqual([
        {
          title: 'background',
          lyrics: '',
        },
        {
          title: 'Verse 1 (1)',
          lyrics: 'We bow our hearts\nWe bend our knees\nOh Spirit come\nMake us humble',
        },
        {
          title: 'Verse 1 (2)',
          lyrics: 'We turn our eyes\nFrom evil things\nOh Lord we cast\nDown our idols',
        },
        {
          title: 'Pre-Chorus',
          lyrics: 'Give us clean hands\nGive us pure hearts\nLet us not lift our\nSouls to another',
        },
        {
          title: 'Chorus',
          lyrics:
            'Oh God let us be\nA generation that seeks\nThat seeks Your face\nOh God of Jacob',
        },
        {
          title: '*blank*',
          lyrics: '',
        },
      ]);
    });

    it('should get the expected SLIDES from a ProPresenter 5 file2 when a slide has a title but no lyrics', () => {
      expect(
        inputConverter.extractSongData(mockPpFiles.pp5File3OneSlideWithLyricsAndNoName).slides
      ).toEqual([
        {
          title: '',
          lyrics: 'We bow our hearts\nWe bend our knees\nOh Spirit come\nMake us humble',
        },
      ]);
    });
  });
});
