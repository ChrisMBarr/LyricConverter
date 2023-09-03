import { TestUtils } from 'test/test-utils';
import { InputTypeSongShowPlus7 } from './input-type-songshowplus7';

describe('InputTypeSongShowPlus7', () => {
  let inputConverter: InputTypeSongShowPlus7;

  beforeEach(() => {
    inputConverter = new InputTypeSongShowPlus7();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a SongShowPlus file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('SongShow Plus', 'empty.sbsong');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a SongPro file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('SongPro', '_empty.sng');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('Plain Text', 'empty.txt');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file when tested', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('ChordPro', 'simple.cho');
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should return a song for an ENGLISH SongShow Plus 7 file1', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('SongShow Plus', 'Be Near.sbsong');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Be Near',
        info: [
          { name: 'Author', value: 'Barnard, Shane' },
          { name: 'Copyright', value: '2003 Waiting Room Music' },
          { name: 'CCLI', value: '4090362' },
          { name: 'Key', value: 'B' },
          { name: 'Topics', value: 'Longing | Security' },
        ],
        slides: [
          {
            title: 'Chorus 1',
            lyrics:
              'Be near O God\nBe near O God of us\nYour nearness is to us our good\nBe near O God\nBe near O God of us\nYour nearness is to us our good\nOur good',
          },
          { title: 'Other', lyrics: '' },
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
            title: 'Ending',
            lyrics: 'My good',
          },
        ],
      });
    });

    it('should return a song for an ENGLISH SongShow Plus 7 file2', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('SongShow Plus', 'Give Us Clean Hands.sbsong');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Give Us Clean Hands',
        info: [
          {
            name: 'Author',
            value: 'Hall, Charlie',
          },
          {
            name: 'Copyright',
            value: '2000 worshiptogether.com songs',
          },
          {
            name: 'CCLI',
            value: '2060208',
          },
          {
            name: 'Key',
            value: 'Ab',
          },
          {
            name: 'Topics',
            value: 'Prayer | Repentance',
          },
        ],
        slides: [
          {
            title: 'Chorus 1',
            lyrics:
              'Give us clean hands\ngive us pure hearts\nLet us not lift our\nsouls to another\nGive us clean hands\ngive us pure hearts\nLet us not lift our\nsouls to another',
          },
          {
            title: 'Chorus',
            lyrics:
              'And oh God let us be\na generation that seeks\nThat seeks Your face\noh God of Jacob\nAnd oh God let us be\na generation that seeks\nThat seeks Your face\noh God of Jacob',
          },
          {
            title: 'Verse 1',
            lyrics:
              'We bow our hearts\nwe bend our knees\nOh Spirit come\nmake us humble\nWe turn our eyes\nfrom evil things\nOh Lord we cast\ndown our idols',
          },
        ],
      });
    });

    it('should return a song for an ENGLISH SongShow Plus 7 file3', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('SongShow Plus', 'Jesus Saves.sbsong');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Jesus Saves (2)',
        info: [
          {
            name: 'Author',
            value: 'Eddie James',
          },
          {
            name: 'Copyright',
            value: '© Fresh Wine Publishing',
          },
        ],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              'Jesus saves from the power\nAnd the penalty of sin\nJesus saves from the torment\nAnd the anguish within\nJesus saves from the bondage\nAnd control of the enemy\nHe heals the broken heart\nAnd set the captives free',
          },
          {
            title: 'Verse 2',
            lyrics:
              "Jesus saves from the guilt\nAnd the shame of what you've done\nJesus saves from a life\nFilled with lies and deception\nJesus saves from the pain of the memories \nThat have scarred your past",
          },
          {
            title: 'Pre-chorus 1',
            lyrics:
              'Gabriel came to Joseph in a dream\nFor by the Holy Spirit Mary conceived\nAnd with a message from heaven\nGabriel came declaring',
          },
          {
            title: 'Chorus 1',
            lyrics:
              'She shall bring forth a Son thou\nShalt call His name Jesus and He shall save\nSave His people from sin and give peace within\nWhat amazing grace - Jesus saves',
          },
          {
            title: 'Verse 3',
            lyrics:
              "Jesus saves, He's the One that has never known sin\nJesus saves, yet for us He took on the sins of men\nJesus saves for he became our sin that we \nMay become the righteousness of God\nJesus saves and now I'll see His face in peace\nJesus saves and I will live with Him eternally\nJesus saves and I will join with the angels\nAround the throne Singing Holy, Holy, Holy",
          },
          {
            title: 'Verse 4',
            lyrics:
              "Jesus saves and today you can leave here set free\nJesus saves and even now He will give you liberty\nJesus saves no matter what, no matter who, no\nMatter where just call Him, He'll answer your prayer\nJesus saves and your life will never be the same\nJesus saves and right now you can be born again\nJesus saves for he that be in Christ\nThe old has past and all is made new",
          },
          {
            title: 'Bridge 1',
            lyrics:
              "Redeemer, liberator, healer, emancipator \nChain-Breaker, strong deliverer, He fights for me\nWarrior, restorer, forgiver, peace make\nJustifier, Intercessor, through Him I'm free",
          },
          {
            title: 'Vamp 1',
            lyrics: "Jesus saves (repeat) Hallelujah (repeat)",
          },
        ],
      });
    });

    it('should return a song for an ENGLISH SongShow Plus 7 file4', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('SongShow Plus', 'You Are.sbsong');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'You Are (2)',
        info: [
          {
            name: 'Author',
            value: 'Jobe, Caleb | Cohen, Ezra | Hesami, Josh | Trimble, Paul',
          },
          {
            name: 'Copyright',
            value: '2010 CFN Music',
          },
          {
            name: 'CCLI',
            value: '5715921',
          },
          {
            name: 'Key',
            value: 'C',
          },
          {
            name: 'Topics',
            value: 'Appreciation | Breakthrough | Christ | Declaration | Jesus',
          },
        ],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              "Bought back from a life in chains\nNow I can sing that I have been redeemed\nYour blood covers all of me\nI'm not ashamed to shout who You are\nI'm living in the light of grace\nMercy made a way to make things bright\nLove overcame the grave in victory in victory",
          },
          {
            title: 'Chorus 1',
            lyrics:
              'You are You are You are the Lord of all\nGave Your life to save us\nFreedom has embraced us\nYou are You are You are the Love for all\nHope of every nation\nAll creation shouts Your glory',
          },
          {
            title: 'Verse 2',
            lyrics:
              "I'm running with a heart that's changed\nEverything to see Your kingdom come\nYou guide every step I take\nI'm not ashamed to shout who You are\nI'm living in a brand new day\nA life to give a life to lift You high\nAll glory and power and praise\nTo You alone to You alone",
          },
          {
            title: 'Bridge',
            lyrics:
              "I'm not ashamed of who You are\nYour love broke through\nAnd grace has made me Yours\nNow upon this Rock I stand\nIn victory in victory\n(REPEAT 3X)",
          },
        ],
      });
    });

    it('should return a song for a SPANISH SongShow Plus 7 file1', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('SongShow Plus', 'Spanish - Devuelveme El Gozo.sbsong');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Devuelveme El Gozo',
        info: [],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              'En medio del dolor \nEn medio de la aflicción\nTu me das paz y \nMe enseñas tu amor \nTodo lo que perdí \nLo restauras Señor en mi \nMe das las fuerza para seguir',
          },
          {
            title: 'Chorus',
            lyrics:
              'Devuelve me el gozo \nDe Tu salvación y\nTu Espíritu noble me sustente \nTe necesito Dios \nSin ti no soy nada \nTe necesito Dios \nDame un nuevo corazón',
          },
        ],
      });
    });

    it('should return a song for a SPANISH SongShow Plus 7 file2', async () => {
      const testFile = await TestUtils.loadTestFileAsRawDataFile('SongShow Plus', 'Spanish - La Sangre (The Blood).sbsong');

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'La Sangre (The Blood)',
        info: [],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              'La sangre de mi Cristo\nque el vertio por mi en la cruz\naun es eficaz, para limpiar tu ser\nporque Cristo nunca perdera su fuerza',
          },
          {
            title: 'Chorus',
            lyrics:
              'Oh, porque alcanza a limpiar nuestras manchas\ny alcanza a curar nuestras llagas\npecador ven al manantial \nque fluyendo esta\ny lavara tu ser\nporque Cristo nunca perdera su fuerza!!',
          },
        ],
      });
    });
  });
});
