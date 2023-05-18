import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeJSON } from './input-type-json';

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
        data: '{}',
      };
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
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

    it('should properly reject a ProPresenter file when tested', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'pro5',
        type: '',
        data: '<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0"></RVPresentationDocument>',
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
        data: '{"title":"Great is your faithfulness O God","info":[{"name":"Order","value":"1C2CBC"}],"slides":[{"title":"Chorus","lyrics":"Your grace is enough\\r\\nYour grace is enough\\r\\nYour grace is enough for me"},{"title":"Verse 1","lyrics":"Great is your faithfulness O God\\r\\nYou wrestle with the sinners heart\\r\\nYou lead us by still waters and to mercy\\r\\nAnd nothing can keep us apart"}]}',
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

    it('should return empty data on a a song if data is missing when extractSongData() is called', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        data: '{}',
      };

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: '',
        info: [],
        slides: [],
      });
    });

    it('should return an empty song when bad data is passed to extractSongData()', () => {
      const testFile: IRawDataFile = {
        name: 'foo',
        ext: 'json',
        type: 'text/json',
        data: 'bad data',
      };

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: '',
        info: [],
        slides: [],
      });
    });
  });
});
