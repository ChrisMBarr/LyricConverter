import { TestUtils } from 'test/test-utils';

import { mockStaticTimestamp } from '../../../../test/mock-song-objects';
import { version } from '../../version';
import { InputTypeMediaShout7 } from './input-type-mediashout7';

describe('InputTypeMediaShout7', () => {
  let inputConverter: InputTypeMediaShout7;

  beforeEach(() => {
    inputConverter = new InputTypeMediaShout7();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a MediaShout file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'The.Blessing.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a plain JSON file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('JSON', 'empty.json');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ProPresenter 5 file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5-empty.pro5');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain-Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should get a single song from a "All.Creatures.or.our.God"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'All.Creatures.or.our.God.json');

      expect(inputConverter.extractSongData(testFile)).toEqual([
        {
          originalFile: {
            extension: inputConverter.fileExt,
            format: inputConverter.name,
            name: testFile.name,
          },
          outputFileName: 'Hymn 002 - All Creatures of our God',
          lyricConverterVersion: version,
          timestamp: mockStaticTimestamp,
          title: 'Hymn 002 - All Creatures of our God',
          info: [{ name: 'Song ID', value: '8bf61074-238e-4704-86ea-5f8443d34e35' }],
          slides: [
            {
              title: 'Verse 1',
              lyrics:
                'All creatures of our God and King.\r\nLift up your voice with us and sing:\r\nAlleluia!  Alleluia! O burning sun\r\nwith golden beam\r\nAnd silver moon with softer gleam:',
            },
            {
              title: 'Chorus 1',
              lyrics: 'Oh, praise Him!\r\nOh, praise Him!\r\nAlleluia, alleluia,\r\nalleluia!',
            },
            {
              title: 'Verse 2',
              lyrics:
                'O rushing wind and breezes soft,\r\nO clouds that ride the winds aloft:\r\nO praise Him! Alleluia!\r\nO rising morn, in praise rejoice,\r\nO lights of evening, find a voice.',
            },
            {
              title: 'Verse 3',
              lyrics:
                'O flowing waters, pure and clear,\r\nMake music for your Lord to hear,\r\nO praise Him! Alleluia!\r\nO fire so masterful and bright,\r\nProviding us with warmth and light,',
            },
            {
              title: 'Verse 4',
              lyrics:
                'Let all things their Creator bless,\r\nAnd worship Him in humbleness,\r\nO praise Him! Alleluia!\r\nOh, praise the Father, praise the Son,\r\nAnd praise the Spirit, three in One!',
            },
          ],
        },
      ]);
    });

    it('should get a song from a "The.Blessing"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'The.Blessing.json');

      expect(inputConverter.extractSongData(testFile)).toEqual([
        {
          originalFile: {
            extension: inputConverter.fileExt,
            format: inputConverter.name,
            name: testFile.name,
          },
          outputFileName: 'The Blessing - Kari Jobe',
          lyricConverterVersion: version,
          timestamp: mockStaticTimestamp,
          title: 'The Blessing - Kari Jobe',
          info: [{ name: 'Song ID', value: '23201acf-959a-4e99-af7a-b02ba54c90b1' }],
          slides: [
            {
              title: 'Verse 1',
              lyrics:
                'The Lord bless you and keep you\r\nMake His face shine upon you and be gracious to you\r\nThe Lord turn His face toward you\r\nAnd give you peace',
            },
            { title: 'Ending 1', lyrics: `Amen, Amen, Amen\r\nAmen, Amen, Amen` },
          ],
        },
      ]);
    });

    it('should get a single song from a "JOY.is.joy"', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'JOY.is.Joy.json');

      expect(inputConverter.extractSongData(testFile)).toEqual([
        {
          originalFile: {
            extension: inputConverter.fileExt,
            format: inputConverter.name,
            name: testFile.name,
          },
          outputFileName: 'JOY is Joy',
          lyricConverterVersion: version,
          timestamp: mockStaticTimestamp,
          title: 'JOY is Joy',
          info: [{ name: 'Song ID', value: '200f9c84-0269-4668-b12e-cfe57409e24e' }],
          slides: [
            { title: 'Verse 1', lyrics: 'JOY is joy\r\nJoy in the Holy Ghost\r\nJOY is joy\r\nJoy in the Lord' },
            {
              title: 'Chorus 1',
              lyrics: 'Don’t let nobody spoil your joy\r\nDon’t let nobody spoil your joy\r\nDon’t let nobody spoil your joy,\r\nJoy in the Lord',
            },
            { title: 'Verse 2', lyrics: 'LOVE love\r\nLove in the Holy Ghost\r\nLOVE Love\r\nLove in the Lord' },
            { title: 'Verse 3', lyrics: 'PEACE\r\nPeace in the Holy Ghost\r\nPEACE\r\nPeace in the Lord' },
          ],
        },
      ]);
    });

    it('should get multiple songs from a file with multiple songs in a single folder', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'multiple-songs.json');

      expect(inputConverter.extractSongData(testFile)).toEqual([
        {
          originalFile: {
            extension: inputConverter.fileExt,
            format: inputConverter.name,
            name: testFile.name,
          },
          outputFileName: 'Holy Holy Holy',
          lyricConverterVersion: version,
          timestamp: mockStaticTimestamp,
          title: 'Holy Holy Holy',
          info: [
            {
              name: 'CCLI Number',
              value: '1156',
            },
            {
              name: 'Song ID',
              value: '00000000-0000-0000-0000-000000000000',
            },
            {
              name: 'Song Number',
              value: 'MS-0078',
            },
            {
              name: 'Authors',
              value: 'John B. Dykes, Reginald Heber',
            },
          ],
          slides: [
            {
              title: 'Verse 1',
              lyrics:
                'Holy, holy, holy,\nLord God Almighty!\nEarly in the morning\nMy song shall rise to Thee.\nHoly, holy, holy!\nMerciful and mighty!\nGod in three Persons,\nBlessed Trinity!',
            },
            {
              title: 'Verse 2',
              lyrics:
                'Holy, holy, holy!\nAll the saints adore Thee,\nCasting down their golden crowns\nAround the glassy sea;\nCherubim and seraphim\nFalling down before Thee,\nWhich wert, and art,\nAnd evermore shall be.',
            },
            {
              title: 'Verse 3',
              lyrics:
                'Holy, holy, holy!\nThough the darkness hide Thee,\nThough the eye of sinful man\nThy glory may not see.\nOnly Thou art holy;\nThere is none beside Thee\nPerfect in power,\nIn love, in purity.',
            },
            {
              title: 'Verse 4',
              lyrics:
                'Holy, holy, holy!\nLord God Almighty!\nAll Thy works shall praise Thy name\nIn earth, and sky, and sea.\nHoly, holy, holy!\nMerciful and mighty!\nGod in three Persons,\nBlessed Trinity.',
            },
          ],
        },
        {
          originalFile: {
            extension: inputConverter.fileExt,
            format: inputConverter.name,
            name: testFile.name,
          },
          outputFileName: 'I Am Thine O Lord',
          lyricConverterVersion: version,
          timestamp: mockStaticTimestamp,
          title: 'I Am Thine O Lord',
          info: [
            {
              name: 'CCLI Number',
              value: '25424',
            },
            {
              name: 'Song ID',
              value: '00000000-0000-0000-0000-000000000000',
            },
            {
              name: 'Song Number',
              value: 'MS-0083',
            },
            {
              name: 'Authors',
              value: 'Fanny J. Crosby, William H. Doane',
            },
          ],
          slides: [
            {
              title: 'Verse 1',
              lyrics:
                'I am Thine O Lord; I have heard Thy voice,\nAnd it told Thy love to me.\nBut I long to rise in the arms of faith,\nAnd be closer drawn to Thee.',
            },
            {
              title: 'Verse 2',
              lyrics:
                'Consecrate me now to Thy service Lord,\nBy the power of grace divine.\nLet my soul look up with a steadfast hope,\nAnd my will be lost in Thine.',
            },
            {
              title: 'Verse 3',
              lyrics:
                'Oh the pure delight of a single hour\nThat before Thy throne I spend,\nWhen I kneel in prayer and with Thee my God,\nI commune as friend with friend!',
            },
            {
              title: 'Verse 4',
              lyrics:
                'There are depths of love that I cannot know\nTill I cross the narrow sea;\nThere are heights of joy that I may not reach\nTill I rest in peace with Thee.',
            },
            {
              title: 'Chorus 1',
              lyrics:
                'Draw me nearer, nearer blessed Lord,\nTo the cross where Thou hast died.\nDraw me nearer, nearer, nearer blessed Lord.\nTo Thy precious bleeding side.',
            },
          ],
        },
        {
          originalFile: {
            extension: inputConverter.fileExt,
            format: inputConverter.name,
            name: testFile.name,
          },
          outputFileName: 'I Believe in You',
          lyricConverterVersion: version,
          timestamp: mockStaticTimestamp,
          title: 'I Believe in You',
          info: [
            {
              name: 'Song ID',
              value: '00000000-0000-0000-0000-000000000000',
            },
            {
              name: 'Song Number',
              value: 'EM-034',
            },
            {
              name: 'Authors',
              value: 'Rick Muchow',
            },
          ],
          slides: [
            {
              title: 'Verse 1',
              lyrics:
                'If everyone who said they believed\nBelieved in You\nIf everyone who said that they follow\nFollow You\nThen why are there so few\nListening to You\nOthers may not want to hear You\nBut I do',
            },
            {
              title: 'Chorus 1',
              lyrics: "You say and I'll go\nWherever You need me to\nI believe in You\nI believe in You",
            },
            {
              title: 'Bridge 1',
              lyrics: 'Just say which way\nI will not delay  oh Lord',
            },
          ],
        },
        {
          originalFile: {
            extension: inputConverter.fileExt,
            format: inputConverter.name,
            name: testFile.name,
          },
          outputFileName: 'I Do Believe',
          lyricConverterVersion: version,
          timestamp: mockStaticTimestamp,
          title: 'I Do Believe',
          info: [
            {
              name: 'CCLI Number',
              value: '124820',
            },
            {
              name: 'Song ID',
              value: '00000000-0000-0000-0000-000000000000',
            },
            {
              name: 'Song Number',
              value: 'MS-0084',
            },
            {
              name: 'Authors',
              value: 'Wesley, Charles',
            },
          ],
          slides: [
            {
              title: 'Verse 1',
              lyrics: 'Father, I stretch my hands to Thee;\nNo other help I know.\nIf Thou withdraw thyself from me,\nAh, whither shall I go?',
            },
            {
              title: 'Verse 2',
              lyrics: 'What did Thine only Son endure\nBefore I drew my breath!\nWhat pain, what labor,\nTo secure my soul from endless death!',
            },
            {
              title: 'Verse 3',
              lyrics: 'Author of faith, to Thee I lift\nMy weary, longing eyes.\nOh, let me now receive that gift;\nMy soul, without it, dies.',
            },
            {
              title: 'Verse 4',
              lyrics: 'Surely Thou canst not let me die;\nOh, speak, and I shall live.\nAnd here I will unwearied lie\nTill Thou Thy Spirit give.',
            },
            {
              title: 'Verse 5',
              lyrics:
                "How would my fainting soul rejoice\nCould I but see Thy face!\nnow let me hear Thy quick'ning voice,\nAnd taste Thy pard'ning grace.",
            },
            {
              title: 'Chorus 1',
              lyrics: 'I do believe, I now believe\nThat Jesus died for me;',
            },
          ],
        },
        {
          originalFile: {
            extension: inputConverter.fileExt,
            format: inputConverter.name,
            name: testFile.name,
          },
          outputFileName: 'I Have Settled the Question',
          lyricConverterVersion: version,
          timestamp: mockStaticTimestamp,
          title: 'I Have Settled the Question',
          info: [
            {
              name: 'CCLI Number',
              value: '125362',
            },
            {
              name: 'Song ID',
              value: '00000000-0000-0000-0000-000000000000',
            },
            {
              name: 'Song Number',
              value: 'MS-0085',
            },
            {
              name: 'Authors',
              value: 'Haldor Lillenas',
            },
          ],
          slides: [
            {
              title: 'Verse 1',
              lyrics:
                'I remember when the Lord\nSpoke to my soul.\nI could feel the heavy burden\nFrom me roll.\nWhen He spoke the gracious words,\n"Wilt Thou be whole?"\nThen I settled the question forever.',
            },
            {
              title: 'Verse 2',
              lyrics:
                'I no longer walk the ways\nOf sinfulness,\nBut I daily tread\nThe paths of righteousness.\nSince the day the Lord\nHas come to my life to bless.\nI have settled the question forever.',
            },
            {
              title: 'Verse 3',
              lyrics:
                "I will choose the holy joys\nThat always last.\nAnd reject sin's pleasures,\nThat will soon be past.\nTo the treasures of true worth,\nI'm holding fast.\nI have settled the question forever.",
            },
            {
              title: 'Verse 4',
              lyrics:
                "Others may deny the Lord\nAnd live in sin.\nBut the race that I have entered\nI must win.\nThro' the pearly gates,\nI mean to enter in.\nI have settled the question forever.",
            },
            {
              title: 'Chorus 1',
              lyrics:
                "I have settled the question,\nHallelujah!\nI will never turn back\nFrom the narrow way.\nI am going thro' with Jesus,\nHallelujah!\n'Til I reach the gates\nOf glory some sweet day.",
            },
          ],
        },
      ]);
    });

    it('should get multiple songs from an entire library file with multiple songs in multiple folders', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('MediaShout', 'multi-folder-library.json');

      expect(inputConverter.extractSongData(testFile).length).toEqual(289);
    });
  });
});
