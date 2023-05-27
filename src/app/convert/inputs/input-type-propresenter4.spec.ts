import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeProPresenter4 } from './input-type-propresenter4';
import * as mockPpFiles from 'test/mock-propresenter-files';
import { TestUtils } from 'test/test-utils';
import {
  mockEmptyJsonFile,
  mockEmptyProPresenter4File,
  mockEmptyProPresenter5File,
  mockSimpleChordProFile,
  mockEmptyTextFile,
} from 'test/mock-raw-files';

describe('InputTypeProPresenter4', () => {
  let inputConverter: InputTypeProPresenter4;

  beforeEach(() => {
    inputConverter = new InputTypeProPresenter4();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a ProPresenter 4 file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyProPresenter4File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ProPresenter 5 file', () => {
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
    it('should get the expected TITLES from ProPresenter 4 files', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp4File1).title).toEqual('Be Near');
      expect(inputConverter.extractSongData(mockPpFiles.pp4File2).title).toEqual(
        'Give Us Clean Hands'
      );
      expect(inputConverter.extractSongData(mockPpFiles.pp4File3).title).toEqual('Jesus Saves');
      expect(inputConverter.extractSongData(mockPpFiles.pp4File4).title).toEqual('You Are');
    });

    it('should get a TITLE from the file name when the file does not have a CCLISongTitle', () => {
      const fileCopy = TestUtils.deepClone(mockPpFiles.pp4File1);
      fileCopy.data = fileCopy.data.replace('CCLISongTitle="Be Near" ', '');
      expect(inputConverter.extractSongData(fileCopy).title).toEqual(fileCopy.name);
    });

    it('should get the expected INFO from a ProPresenter 4 file1', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp4File1).info).toEqual([
        { name: 'creatorCode', value: 1349676880 },
        { name: 'category', value: 'Song' },
        { name: 'CCLISongTitle', value: 'Be Near' },
        { name: 'CCLIPublisher', value: 'Waiting Room Music' },
        { name: 'CCLICopyrightInfo', value: 2003 },
      ]);
    });

    it('should get the expected INFO from a ProPresenter 4 file2', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp4File2).info).toEqual([
        { name: 'creatorCode', value: 1349676880 },
        { name: 'category', value: 'Song' },
        { name: 'author', value: 'Charlie Hall' },
        { name: 'CCLISongTitle', value: 'Give Us Clean Hands' },
        {
          name: 'CCLIPublisher',
          value:
            'worshiptogether.com songs | sixsteps Music (Admin. by EMI Christian Music Publishing) | (Admin. by EMI Christian Music Publishing)',
        },
        { name: 'CCLICopyrightInfo', value: 2000 },
        { name: 'CCLILicenseNumber', value: 2060208 },
      ]);
    });

    it('should get the expected SLIDES from a ProPresenter 4 file1', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp4File1).slides).toEqual([
        {
          title: 'Chorus 1',
          lyrics:
            'Be near O God\nBe near O God of us\nYour nearness is to us our good\nBe near O God\nBe near O God of us\nYour nearness is to us our good\nOur good',
        },
        {
          title: 'Verse 1',
          lyrics:
            "You are all big and small\nBeautiful\nAnd wonderful\nTo trust in grace through faith\nBut I'm asking to taste",
        },
        {
          title: 'Verse 2',
          lyrics:
            'For dark is light to You\nDepths are height to You\nFar is near\nBut Lord I need to hear from You',
        },
        {
          title: 'Verse 3',
          lyrics:
            'Your fullness is mine\nRevelation divine\nBut oh to taste\nTo know much more than a page\nTo feel Your embrace',
        },
        {
          title: 'Verse 4',
          lyrics:
            'For dark is light to You\nDepths are height to You\nFar is near\nBut Lord I need to hear from You',
        },
        {
          title: '',
          lyrics: 'My good',
        },
      ]);
    });

    it('should get the expected SLIDES from a ProPresenter 4 file2', () => {
      expect(inputConverter.extractSongData(mockPpFiles.pp4File2).slides).toEqual([
        {
          title: 'Verse 1',
          lyrics:
            'We bow our hearts we bend our knees\nOh Spirit come make us humble\nWe turn our eyes from evil things\nOh Lord we cast down our idols',
        },
        {
          title: 'Chorus 1',
          lyrics:
            'Give us clean hands give us pure hearts\nLet us not lift our souls to another\nGive us clean hands give us pure hearts\nLet us not lift our souls to another',
        },
        {
          title: 'Chorus 1',
          lyrics:
            'Oh God let us be a generation\n That seeks\nThat seeks Your face oh God of Jacob\nOh God let us be a generation                  That seeks\nThat seeks Your face oh God of Jacob',
        },
        {
          title: 'Verse 1',
          lyrics:
            'We bow our hearts we bend our knees\nOh Spirit come make us humble\nWe turn our eyes from evil things\nOh Lord we cast down our idols',
        },
        {
          title: 'Chorus 1',
          lyrics:
            'Give us clean hands give us pure hearts\nLet us not lift our souls to another\nGive us clean hands give us pure hearts\nLet us not lift our souls to another',
        },
        {
          title: 'Chorus 1',
          lyrics:
            'Oh God let us be a generation\n That seeks\nThat seeks Your face oh God of Jacob\nOh God let us be a generation                  That seeks\nThat seeks Your face oh God of Jacob',
        },
      ]);
    });
  });
});
