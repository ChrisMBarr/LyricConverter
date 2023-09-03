import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeProPresenter4 } from './input-type-propresenter4';
import { TestUtils } from 'test/test-utils';

describe('InputTypeProPresenter4', () => {
  let inputConverter: InputTypeProPresenter4;

  beforeEach(() => {
    inputConverter = new InputTypeProPresenter4();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a ProPresenter 4 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v4 - empty.pro4');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ProPresenter 5 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file with a .cho extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file with a .pro extension', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      testFile.ext = 'pro';
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should get a TITLE from the file name when the file does not have a CCLISongTitle', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile(
        'ProPresenter',
        'v4 - Be Near.pro4'
      );

      testFile.dataAsString = testFile.dataAsString.replace('CCLISongTitle="Be Near" ', '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });

    it('should get a song from a ProPresenter 4 file1', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile(
        'ProPresenter',
        'v4 - Be Near.pro4'
      );

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Be Near',
        info: [
          { name: 'Category', value: 'Song' },
          { name: 'Copyright', value: 2003 },
          { name: 'Creator Code', value: 1349676880 },
          { name: 'Publisher', value: 'Waiting Room Music' },
        ],
        slides: [
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
        ],
      });
    });

    it('should get a song from a ProPresenter 4 file2', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile(
        'ProPresenter',
        'v4 - Give Us Clean Hands.pro4'
      );

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Give Us Clean Hands',
        info: [
          { name: 'Author', value: 'Charlie Hall' },
          { name: 'CCLI Number', value: 2060208 },
          { name: 'Category', value: 'Song' },
          { name: 'Copyright', value: 2000 },
          { name: 'Creator Code', value: 1349676880 },
          {
            name: 'Publisher',
            value:
              'worshiptogether.com songs | sixsteps Music (Admin. by EMI Christian Music Publishing) | (Admin. by EMI Christian Music Publishing)',
          },
        ],
        slides: [
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
        ],
      });
    });
  });
});
