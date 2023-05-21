import { TestUtils } from 'test/test-utils';
import { IRawDataFile } from '../models/file.model';
import { InputTypeOpenLyrics } from './input-type-openlyrics';
import * as mockOpenLyrics from 'test/mock-openlyrics-files';
import * as mockRawFiles from 'test/mock-raw-files';

describe('InputTypeOpenLyrics', () => {
  let inputConverter: InputTypeOpenLyrics;

  beforeEach(() => {
    inputConverter = new InputTypeOpenLyrics();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a OpenLyrics XML file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsFileSimpleFile
      );
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a plain text file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockRawFiles.mockEmptyTextFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockRawFiles.mockSimpleChordProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockRawFiles.mockEmptyJsonFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockRawFiles.mockEmptyProPresenter5File);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should return a song for a simple OpenLyrics file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsFileSimpleFile
      );

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Amazing Grace',
        info: [],
        slides: [
          {
            title: 'v1',
            lyrics: 'Amazing grace how sweet the sound\nthat saved a wretch like me;',
          },
        ],
      });
    });

    it('should return a song for a complex OpenLyrics file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsFileComplexFile
      );

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Amazing Grace',
        info: [
          {
            name: 'Authors',
            value: 'John Newton, Chris Rice, Richard Wagner, František Foo',
          },
          {
            name: 'Comment',
            value: 'This is one of the most popular songs in our congregation.',
          },
          {
            name: 'Song Book 1',
            value: 'Songbook without Number',
          },
          {
            name: 'Song Book 2',
            value: 'Songbook with Number (entry 48)',
          },
          {
            name: 'Song Book 3',
            value: 'Songbook with Letters in Entry Name (entry 153c)',
          },
          { name: 'Tempo', value: '90bpm' },
          {
            name: 'Themes',
            value: 'Adoration, Grace, Praise, Salvation, Graça, Adoração, Salvação',
          },
          { name: 'copyright', value: 'public domain' },
          { name: 'ccliNo', value: '4639462' },
          { name: 'released', value: '1779' },
          { name: 'transposition', value: '2' },
          { name: 'key', value: 'C#' },
          { name: 'variant', value: 'Newsboys' },
          { name: 'publisher', value: 'Sparrow Records' },
          { name: 'keywords', value: 'something to help with more accurate results' },
          { name: 'verseOrder', value: 'v1 v2  v3 c v4 c1 c2 b b1 b2' },
        ],
        slides: [
          {
            title: 'v1 (en)',
            lyrics: 'Amazing grace how sweet the sound that saved a wretch like me;\nA b c\nD e f',
          },
          {
            title: 'v1 (de)',
            lyrics: 'Erstaunliche Ahmut, wie',
          },
          {
            title: 'c',
            lyrics: 'any comment\nLine content.',
          },
          {
            title: 'v2 (en-US)',
            lyrics:
              'any text\nAmazing grace how sweet the sound that saved a wretch like me;\nany text\nAmazing grace how sweet the sound that saved a wretch like me;\nAmazing grace how sweet the sound that saved a wretch like me;\nA b c\n\nD e f',
          },
          {
            title: 'e (de)',
            lyrics: 'This is text of ending.',
          },
        ],
      });
    });

    it('should use the filename for the title if there is no title', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsFileSimpleFile
      );

      //remove the titles so the parser can't find one
      testFile.data = testFile.data.replace(/<titles>[\W\w]+?<\/titles>/, '');

      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });

    it('should return a song for a OpenLyrics example file 1', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockOpenLyrics.mockOpenLyricsSongFile1);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Amazing Grace',
        info: [
          { name: 'Author', value: 'John Newton' },
          { name: 'Themes', value: `God's Attributes` },
          { name: 'copyright', value: '1982 Jubilate Hymns Limited' },
          { name: 'ccliNo', value: '1037882' },
        ],
        slides: [
          {
            title: 'v1',
            lyrics:
              "Amazing grace how sweet the sound that saved a wretch like me;\n\nI once was lost but now I'm found, was blind but now I see.",
          },
          {
            title: 'v2',
            lyrics:
              'Twas grace that taught my heart to fear, and grace my fears relieved;\n\nHow precious did that grace appear the hour I first believed!',
          },
          {
            title: 'v3',
            lyrics:
              "Through many dangers, toils, and snares I have already come;\n\n'Tis grace that brought me safe thus far and grace will lead me home.",
          },
          {
            title: 'v4',
            lyrics:
              "When we've been there ten thousand years bright shining as the sun;\n\nWe've no less days to sing God's praise than when we'd first begun!",
          },
        ],
      });
    });

    it('should return a song for a OpenLyrics example file 2', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockOpenLyrics.mockOpenLyricsSongFile2);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'It Is Well With My Soul',
        info: [
          { name: 'Authors', value: 'Horatio Spafford, Philip Bliss' },
          { name: 'Themes', value: 'Peace, Assurance, Trust' },
          { name: 'copyright', value: 'Public Domain' },
          { name: 'ccliNo', value: '25376' },
          { name: 'verseOrder', value: 'v1 c v2 c v3 c v4 c' },
        ],
        slides: [
          {
            title: 'v1',
            lyrics:
              'When peace like a river attendeth my way,\n\nWhen sorrows like sea billows roll;\n\nWhatever my lot, Thou hast taught me to say,\n\n“It is well, it is well with my soul.”',
          },
          {
            title: 'c',
            lyrics:
              'It is well, (it is well,)\n\nWith my soul, (with my soul,)\n\nIt is well, it is well with my soul.',
          },
          {
            title: 'v2',
            lyrics:
              'Though Satan should buffet, though trials should come,\n\nLet this blest assurance control,\n\nThat Christ has regarded my helpless estate,\n\nAnd hath shed his own blood for my soul.',
          },
          {
            title: 'v3',
            lyrics:
              'My sin, oh the bliss of this glorious thought!\n\nMy sin, not in part but the whole\n\nIs nailed to the cross, and I bear it no more,\n\nPraise the Lord, praise the Lord, O my soul!',
          },
          {
            title: 'v4',
            lyrics:
              'And, Lord, haste the day when my faith shall be sight,\n\nThe clouds be rolled back as a scroll;\n\nThe trump shall resound, and the Lord shall descend,\n\nEven so, it is well with my soul.',
          },
        ],
      });
    });

    it('should return a song for a OpenLyrics example file 3 - a single songbook and multiple comments', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockOpenLyrics.mockOpenLyricsSongFile3);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'It Is Well With My Soul',
        info: [
          { name: 'Comment 1', value: 'First' },
          { name: 'Comment 2', value: 'Second' },
          { name: 'Song Book', value: 'Single (entry 48)' },
        ],
        slides: [],
      });
    });

    it('should return a song for a OpenLyrics example file with Hebrew lyrics and transliterated lyrics', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(
        mockOpenLyrics.mockOpenLyricsSongFileHebrew
      );

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'הבה נגילה',
        info: [
          { name: 'Themes', value: 'הבה נגילה, Hava Nagila, Rejoice' },
          { name: 'copyright', value: 'public domain' },
          { name: 'variant', value: 'Hebrew folk song' },
        ],
        slides: [
          {
            title: 'v1 (he)',
            lyrics: 'הבה נגילה\n\nהבה נגילה\n\nהבה נגילה ונשמחה',
          },
          {
            title: 'v1 (he - transliterated in en)',
            lyrics: "Hava nagila\n\nHava nagila\n\nHava nagila vi nis'mecha",
          },
          {
            title: 'v1 (en)',
            lyrics: "Let's rejoice\n\nLet's rejoice\n\nLet's rejoice and be happy",
          },
          {
            title: 'c (he)',
            lyrics: 'הבה נרננה\n\nהבה נרננה\n\nהבה נרננה ונשמחה',
          },
          {
            title: 'c (he - transliterated in en)',
            lyrics: "Hava neranenah\n\nHava neranenah\n\nHava neranenah vi nis'mecha",
          },
          {
            title: 'c (en)',
            lyrics: "Let's sing\n\nLet's sing\n\nLet's sing and be happy",
          },
          {
            title: 'b (he)',
            lyrics: '!עורו, עורו אחים\n\nעורו אחים בלב שמח\n\n!עורו אחים, עורו אחים\n\nבלב שמח',
          },
          {
            title: 'b (he - transliterated in en)',
            lyrics:
              "Uru, uru achim!\n\nUru achim b'lev sameach\n\n\nUru achim, uru achim!\n\nB'lev sameach",
          },
          {
            title: 'b (en)',
            lyrics:
              'Awake, awake, brothers!\n\nAwake brothers with a happy heart\n\nAwake, brothers, awake, brothers!\n\nWith a happy heart',
          },
        ],
      });
    });
  });
});
