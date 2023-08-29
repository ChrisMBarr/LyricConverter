import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeJSON } from './input-type-json';
import { LyricConverterError } from '../models/errors.model';

describe('InputTypeJSON', () => {
  let inputConverter: InputTypeJSON;

  beforeEach(() => {
    inputConverter = new InputTypeJSON();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly accept JSON files when tested', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
        dataAsString: '{}',
      };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly reject plain text files when tested', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'txt',
        type: 'text/plain',
        dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
        dataAsString: 'this is some plain text',
      };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly reject a ProPresenter file when tested', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'pro5',
        type: '',
        dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
        dataAsString: '<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0"></RVPresentationDocument>',
      };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should return a song when extractSongData() is called', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
        dataAsString: '{"title":"Great is your faithfulness O God","info":[{"name":"Order","value":"1C2CBC"}],"slides":[{"title":"Chorus","lyrics":"Your grace is enough\\r\\nYour grace is enough\\r\\nYour grace is enough for me"},{"title":"Verse 1","lyrics":"Great is your faithfulness O God\\r\\nYou wrestle with the sinners heart\\r\\nYou lead us by still waters and to mercy\\r\\nAnd nothing can keep us apart"}]}',
      };

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Great is your faithfulness O God',
        info: [
          {
            name: 'Order',
            value: '1C2CBC',
          },
        ],
        slides: [
          {
            title: 'Chorus',
            lyrics: 'Your grace is enough\r\nYour grace is enough\r\nYour grace is enough for me',
          },
          {
            title: 'Verse 1',
            lyrics:
              'Great is your faithfulness O God\r\nYou wrestle with the sinners heart\r\nYou lead us by still waters and to mercy\r\nAnd nothing can keep us apart',
          },
        ],
      });
    });

    it('should throw a custom error if data is missing when extractSongData() is called', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
        dataAsString: '{}',
      };

      const err = new LyricConverterError(
        `This file is not formatted as a LyricConverter JSON file`
      );
      expect(() => inputConverter.extractSongData(testFile)).toThrow(err);
    });

    it('should throw a native error when bad data is passed to extractSongData()', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
        dataAsString: 'bad data',
      };

      //We can't test against specific error messages thrown due to error message text differences in how browsers report them
      expect(() => inputConverter.extractSongData(testFile)).toThrowError();
    });
  });
});
