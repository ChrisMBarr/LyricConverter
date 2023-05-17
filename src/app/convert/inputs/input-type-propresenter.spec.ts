import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeProPresenter } from './input-type-propresenter';
import * as mockPpFiles from 'test/mock-propresenter-files';

describe('InputTypeProPresenter', () => {
  let inputConverter: InputTypeProPresenter;

  beforeEach(() => {
    inputConverter = new InputTypeProPresenter();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly accept a ProPresenter 4 file when tested', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'pro4',
        type: '',
        data: '<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0"></RVPresentationDocument>',
      };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly accept a ProPresenter 5 file when tested', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'pro5',
        type: '',
        data: '<RVPresentationDocument height="768" width="1024" versionNumber="500" docType="0"></RVPresentationDocument>',
      };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly reject a JSON file when tested', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        data: '{}',
      };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject plain text files when tested', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'txt',
        type: 'text/plain',
        data: 'this is some plain text',
      };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    describe('ProPresenter V4 Files', () => {
      it('should get the expected TITLES from ProPresenter 4 files', () => {
        expect(inputConverter.extractSongData(mockPpFiles.pp4File1).title).toEqual('Be Near');
        expect(inputConverter.extractSongData(mockPpFiles.pp4File2).title).toEqual(
          'Give Us Clean Hands'
        );
        expect(inputConverter.extractSongData(mockPpFiles.pp4File3).title).toEqual('Jesus Saves');
        expect(inputConverter.extractSongData(mockPpFiles.pp4File4).title).toEqual('You Are');
      });

      it('should get a TITLE from the file name when the file does not have a CCLISongTitle', () => {
        const fileCopy = { ...mockPpFiles.pp4File1 };
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
    });

    describe('ProPresenter V5 Files', () => {
      it('should get the expected TITLES from ProPresenter 5 files', () => {
        expect(inputConverter.extractSongData(mockPpFiles.pp5File1).title).toEqual('Be Near');
        expect(inputConverter.extractSongData(mockPpFiles.pp5File2).title).toEqual(
          'Give Us Clean Hands'
        );
      });

      it('should get a TITLE from the file name when the file does not have a CCLISongTitle', () => {
        const fileCopy = { ...mockPpFiles.pp5File1 };
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
    });
  });
});
