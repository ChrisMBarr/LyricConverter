import { InputTypeOpenLyrics } from './input-type-openlyrics';
import { TestUtils } from 'test/test-utils';
import { mockStaticTimestamp } from '../../../../test/mock-song-objects';
import { version } from '../../version';

describe('InputTypeOpenLyrics', () => {
  let inputConverter: InputTypeOpenLyrics;

  beforeEach(() => {
    inputConverter = new InputTypeOpenLyrics();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a OpenLyrics XML file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/examples', 'simple.xml');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a plain text file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a JSON file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should return a song for a simple OpenLyrics file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/examples', 'simple.xml');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
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

    it('should return a song for a complex OpenLyrics file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/examples', 'complex.xml');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Amazing Grace',
        info: [
          { name: 'ccliNo', value: '4639462' },
          { name: 'copyright', value: 'public domain' },
          { name: 'key', value: 'C#' },
          { name: 'keywords', value: 'something to help with more accurate results' },
          { name: 'publisher', value: 'Sparrow Records' },
          { name: 'released', value: '1779' },
          { name: 'Tempo', value: '90bpm' },
          { name: 'transposition', value: '2' },
          { name: 'variant', value: 'Newsboys' },
          { name: 'verseOrder', value: 'v1 v2  v3 c v4 c1 c2 b b1 b2' },
          {
            name: 'Authors',
            value: 'John Newton | Chris Rice (words) | Richard Wagner (music) | František Foo (translation)',
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

          {
            name: 'Themes',
            value: 'Adoration | Grace | Praise | Salvation | Graça | Adoração | Salvação',
          },
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
            lyrics: 'Line content.',
          },
          {
            title: 'v2 (en-US)',
            lyrics:
              'Amazing grace how sweet the sound that saved a wretch like me;\n\nAmazing grace how sweet the sound that saved a wretch like me;\nAmazing grace how sweet the sound that saved a wretch like me;\nA b c\n\nD e f',
          },
          {
            title: 'e (de)',
            lyrics: 'This is text of ending.',
          },
        ],
      });
    });

    it('should use the filename for the title if there is no title', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/examples', 'simple.xml');

      //remove the titles so the parser can't find one
      testFile.dataAsString = testFile.dataAsString.replace(/<titles>[\W\w]+?<\/titles>/, '');

      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });

    it('should ignore/exclude comments from the song lyrics', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/examples', 'simple.xml');

      testFile.dataAsString = testFile.dataAsString.replace(
        'how sweet the sound',
        'how sweet <!-- a comment and  <chord name="a tag here"/> -->the sound',
      );

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
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

    it('should return a song for a OpenLyrics example file 1', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/songs', 'Amazing Grace.xml');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'Amazing Grace',
        info: [
          { name: 'ccliNo', value: '1037882' },
          { name: 'copyright', value: '1982 Jubilate Hymns Limited' },
          { name: 'Author', value: 'John Newton' },
          { name: 'Themes', value: `God's Attributes` },
        ],
        slides: [
          {
            title: 'v1',
            lyrics: "Amazing grace how sweet the sound that saved a wretch like me;\nI once was lost but now I'm found, was blind but now I see.",
          },
          {
            title: 'v2',
            lyrics:
              'Twas grace that taught my heart to fear, and grace my fears relieved;\nHow precious did that grace appear the hour I first believed!',
          },
          {
            title: 'v3',
            lyrics:
              "Through many dangers, toils, and snares I have already come;\n'Tis grace that brought me safe thus far and grace will lead me home.",
          },
          {
            title: 'v4',
            lyrics:
              "When we've been there ten thousand years bright shining as the sun;\nWe've no less days to sing God's praise than when we'd first begun!",
          },
        ],
      });
    });

    it('should return a song for a OpenLyrics example file 2', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/songs', 'It Is Well With My Soul.xml');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'It Is Well With My Soul',
        info: [
          { name: 'ccliNo', value: '25376' },
          { name: 'copyright', value: 'Public Domain' },
          { name: 'verseOrder', value: 'v1 c v2 c v3 c v4 c' },
          { name: 'Authors', value: 'Horatio Spafford | Philip Bliss' },
          { name: 'Themes', value: 'Peace | Assurance | Trust' },
        ],
        slides: [
          {
            title: 'v1',
            lyrics:
              'When peace like a river attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to say,\n“It is well, it is well with my soul.”',
          },
          {
            title: 'c',
            lyrics: 'It is well, (it is well,)\nWith my soul, (with my soul,)\nIt is well, it is well with my soul.',
          },
          {
            title: 'v2',
            lyrics:
              'Though Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ has regarded my helpless estate,\nAnd hath shed his own blood for my soul.',
          },
          {
            title: 'v3',
            lyrics:
              'My sin, oh the bliss of this glorious thought!\nMy sin, not in part but the whole\nIs nailed to the cross, and I bear it no more,\nPraise the Lord, praise the Lord, O my soul!',
          },
          {
            title: 'v4',
            lyrics:
              'And, Lord, haste the day when my faith shall be sight,\nThe clouds be rolled back as a scroll;\nThe trump shall resound, and the Lord shall descend,\nEven so, it is well with my soul.',
          },
        ],
      });
    });

    it('should return a song for a OpenLyrics example file 3 - a single songbook and multiple comments', async () => {
      // const testFile: IRawDataFile = structuredClone(mockOpenLyrics.mockOpenLyricsSongFile3);
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/examples', 'multiple-comments.xml');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'It Is Well With My Soul',
        info: [
          { name: 'Comment 1', value: 'First' },
          { name: 'Comment 2', value: 'Second' },
          { name: 'Song Book', value: 'Single (entry 48)' },
        ],
        slides: [],
      });
    });

    it('should return a song for a OpenLyrics example file with Hebrew lyrics and transliterated lyrics', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('OpenLyrics/songs', 'Hava Nagila.xml');

      const normalizedSongData = TestUtils.normalizeSongTimestamp(inputConverter.extractSongData(testFile));
      expect(normalizedSongData).toEqual({
        originalFile: {
          extension: inputConverter.fileExt,
          format: inputConverter.name,
          name: testFile.name,
        },
        lyricConverterVersion: version,
        timestamp: mockStaticTimestamp,
        title: 'הבה נגילה',
        info: [
          { name: 'copyright', value: 'public domain' },
          { name: 'variant', value: 'Hebrew folk song' },
          { name: 'Themes', value: 'הבה נגילה | Hava Nagila | Rejoice' },
        ],
        slides: [
          {
            title: 'v1 (he)',
            lyrics: 'הבה נגילה\nהבה נגילה\nהבה נגילה ונשמחה',
          },
          {
            title: 'v1 (he - transliterated in en)',
            lyrics: "Hava nagila\nHava nagila\nHava nagila vi nis'mecha",
          },
          {
            title: 'v1 (en)',
            lyrics: "Let's rejoice\nLet's rejoice\nLet's rejoice and be happy",
          },
          {
            title: 'c (he)',
            lyrics: 'הבה נרננה\nהבה נרננה\nהבה נרננה ונשמחה',
          },
          {
            title: 'c (he - transliterated in en)',
            lyrics: "Hava neranenah\nHava neranenah\nHava neranenah vi nis'mecha",
          },
          {
            title: 'c (en)',
            lyrics: "Let's sing\nLet's sing\nLet's sing and be happy",
          },
          {
            title: 'b (he)',
            lyrics: '!עורו, עורו אחים\nעורו אחים בלב שמח\n!עורו אחים, עורו אחים\nבלב שמח',
          },
          {
            title: 'b (he - transliterated in en)',
            lyrics: "Uru, uru achim!\nUru achim b'lev sameach\n\nUru achim, uru achim!\nB'lev sameach",
          },
          {
            title: 'b (en)',
            lyrics: 'Awake, awake, brothers!\nAwake brothers with a happy heart\nAwake, brothers, awake, brothers!\nWith a happy heart',
          },
        ],
      });
    });
  });
});
