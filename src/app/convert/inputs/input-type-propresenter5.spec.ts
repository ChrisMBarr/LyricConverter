import { InputTypeProPresenter5 } from './input-type-propresenter5';
import { TestUtils } from 'test/test-utils';

describe('InputTypeProPresenter5', () => {
  let inputConverter: InputTypeProPresenter5;

  beforeEach(() => {
    inputConverter = new InputTypeProPresenter5();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a ProPresenter 5 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a ProPresenter 4 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v4 - empty.pro4');
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
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - Be Near.pro5');

      testFile.dataAsString = testFile.dataAsString.replace('CCLISongTitle="Be Near" ', '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });

    it('should get a song from a ProPresenter 5 file1', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - Be Near.pro5');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Be Near',
        info: [
          { name: 'Artist', value: 'Shane Bernard' },
          { name: 'Category', value: 'Song' },
          { name: 'Copyright', value: 2003 },
          { name: 'Creator Code', value: 1349676880 },
          { name: 'Publisher', value: 'Waiting Room Music' },
        ],
        slides: [
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
            lyrics: 'For dark is light to You\nDepths are Height to you\nFar is near\nBut Lord I need to hear from You',
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
        ],
      });
    });

    it('should get a song from a ProPresenter 5 file2', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - Give Us Clean Hands.pro5');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Give Us Clean Hands',
        info: [
          { name: 'Artist', value: 'Charlie Hall' },
          { name: 'Author', value: 'Charlie Hall' },
          { name: 'CCLI Number', value: 2060208 },
          { name: 'Category', value: 'Song' },
          { name: 'Copyright', value: 2000 },
          { name: 'Creator Code', value: 1349676880 },
        ],
        slides: [
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
            lyrics: 'Oh God let us be\nA generation that seeks\nThat seeks Your face\nOh God of Jacob',
          },
          {
            title: '*blank*',
            lyrics: '',
          },
        ],
      });
    });

    it('should get the expected SLIDES from a ProPresenter 5 file2 when a slide has no title but lyrics', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - single-unnamed-slide.pro5');

      expect(inputConverter.extractSongData(testFile).slides).toEqual([
        {
          title: '',
          lyrics: 'We bow our hearts\nWe bend our knees\nOh Spirit come\nMake us humble',
        },
      ]);
    });
  });
});
