import {
  mockEmptySongShowPlusFile,
  mockEmptySongProFile,
  mockEmptyTextFile,
  mockSimpleChordProFile,
} from 'test/mock-raw-files';
import { TestUtils } from 'test/test-utils';
import { IRawDataFile } from '../models/file.model';
import { InputTypeSongShowPlus7 } from './input-type-songshowplus7';
import {
  mockSongShowPlusFile1,
  mockSongShowPlusFile2,
  mockSongShowPlusFile3,
  mockSongShowPlusFile4,
  mockSongShowPlusSpanishFile1,
  mockSongShowPlusSpanishFile2,
} from 'test/mock-songshowplus7-files';

describe('InputTypeSongShowPlus7', () => {
  let inputConverter: InputTypeSongShowPlus7;

  beforeEach(() => {
    inputConverter = new InputTypeSongShowPlus7();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a SongPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptySongShowPlusFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
    });

    it('should properly REJECT a SongPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptySongProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a plain text file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptyTextFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });

    it('should properly REJECT a ChordPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSimpleChordProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
    });
  });

  describe('extractSongData()', () => {
    it('should return a song for an ENGLISH SongShow Plus 7 file1', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongShowPlusFile1);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Be Near',
        info: [
          { name: 'Artist/Author', value: 'Barnard, Shane' },
          { name: 'Copyright', value: '2003 Waiting Room Music' },
          { name: 'CCLI', value: '4090362' },
          { name: 'Keywords', value: "Longing, Security'" },
        ],
        slides: [
          {
            title: 'Chorus 1',
            lyrics:
              'Be near O God\r\nBe near O God of us\r\nYour nearness is to us our good\r\nBe near O God\r\nBe near O God of us\r\nYour nearness is to us our good\r\nOur good',
          },
          {
            title: 'Other',
            lyrics: '',
          },
          {
            title: 'Verse 1',
            lyrics:
              "oYou are all big and small\r\nBeautiful\r\nAnd wonderful\r\nTo trust in grace through faith\r\nBut I'm asking to taste",
          },
          {
            title: 'Verse 2',
            lyrics:
              'eFor dark is light to You\r\nDepths are height to You\r\nFar is near\r\nBut Lord I need to hear from You',
          },
          {
            title: 'Verse 3',
            lyrics:
              'pYour fullness is mine\r\nRevelation divine\r\nBut oh to taste\r\nTo know much more than a page\r\nTo feel Your embrace',
          },
          {
            title: 'Verse 4',
            lyrics:
              'cFor dark is light to You\r\nDepths are height to You\r\nFar is near\r\nBut Lord I need to hear from You',
          },
          {
            title: 'Ending',
            lyrics: 'My good\r\n',
          },
        ],
      });
    });

    it('should return a song for an ENGLISH SongShow Plus 7 file2', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongShowPlusFile2);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Give Us Clean Hands',
        info: [
          {
            name: 'Artist/Author',
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
            name: 'Keywords',
            value: 'Prayer, \nRepentance',
          },
        ],
        slides: [
          {
            title: 'Chorus 1',
            lyrics:
              'Give us clean hands\r\ngive us pure hearts\r\nLet us not lift our\r\nsouls to another\r\nGive us clean hands\r\ngive us pure hearts\r\nLet us not lift our\r\nsouls to another',
          },
          {
            title: 'Chorus',
            lyrics:
              'And oh God let us be\r\na generation that seeks\r\nThat seeks Your face\r\noh God of Jacob\r\nAnd oh God let us be\r\na generation that seeks\r\nThat seeks Your face\r\noh God of Jacob',
          },
          {
            title: 'Verse 1',
            lyrics:
              'We bow our hearts\r\nwe bend our knees\r\nOh Spirit come\r\nmake us humble\r\nWe turn our eyes\r\nfrom evil things\r\nOh Lord we cast\r\ndown our idols\r\n',
          },
        ],
      });
    });

    it('should return a song for an ENGLISH SongShow Plus 7 file3', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongShowPlusFile3);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Jesus Saves (2)',
        info: [
          {
            name: 'Artist/Author',
            value: 'Eddie James',
          },
          {
            name: 'Copyright',
            value: 'Â© Fresh Wine Publishing',
          },
        ],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              'Jesus saves from the power\r\nAnd the penalty of sin\r\nJesus saves from the torment\r\nAnd the anguish within\r\nJesus saves from the bondage\r\nAnd control of the enemy\r\nHe heals the broken heart\r\nAnd set the captives free',
          },
          {
            title: 'Verse 2',
            lyrics:
              "Jesus saves from the guilt\r\nAnd the shame of what you've done\r\nJesus saves from a life\r\nFilled with lies and deception\r\nJesus saves from the pain of the memories \r\nThat have scarred your past",
          },
          {
            title: 'Pre-chorus 1',
            lyrics:
              'Gabriel came to Joseph in a dream\r\nFor by the Holy Spirit Mary conceived\r\nAnd with a message from heaven\r\nGabriel came declaring',
          },
          {
            title: 'Chorus 1',
            lyrics:
              'She shall bring forth a Son thou\r\nShalt call His name Jesus and He shall save\r\nSave His people from sin and give peace within\r\nWhat amazing grace - Jesus saves',
          },
          {
            title: 'Verse 3r',
            lyrics:
              "Jesus saves, He's the One that has never known sin\r\nJesus saves, yet for us He took on the sins of men\r\nJesus saves for he became our sin that we \r\nMay become the righteousness of God\r\nJesus saves and now I'll see His face in peace\r\nJesus saves and I will live with Him eternally\r\nJesus saves and I will join with the angels\r\nAround the throne Singing Holy, Holy, Holy",
          },
          {
            title: 'Verse 4z',
            lyrics:
              "Jesus saves and today you can leave here set free\r\nJesus saves and even now He will give you liberty\r\nJesus saves no matter what, no matter who, no\r\nMatter where just call Him, He'll answer your prayer\r\nJesus saves and your life will never be the same\r\nJesus saves and right now you can be born again\r\nJesus saves for he that be in Christ\r\nThe old has past and all is made new",
          },
          {
            title: 'Bridge 1',
            lyrics:
              "Redeemer, liberator, healer, emancipator \r\nChain-Breaker, strong deliverer, He fights for me\r\nWarrior, restorer, forgiver, peace make\r\nJustifier, Intercessor, through Him I'm free",
          },
          {
            title: 'Vamp 1',
            lyrics: "Jesus saves (repeat) Hallelujah (repeat)\r\n'(",
          },
        ],
      });
    });

    it('should return a song for an ENGLISH SongShow Plus 7 file4', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongShowPlusFile4);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'You Are (2)',
        info: [
          {
            name: 'Artist/Author',
            value: '8Jobe, Caleb | Cohen, Ezra | Hesami, Josh | Trimble, Paul',
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
            name: 'Keywords',
            value: "Appreciation, Breakthrough, Christ, Declaration, Jesus'",
          },
        ],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              "Bought back from a life in chains\r\nNow I can sing that I have been redeemed\r\nYour blood covers all of me\r\nI'm not ashamed to shout who You are\r\nI'm living in the light of grace\r\nMercy made a way to make things bright\r\nLove overcame the grave in victory in victory",
          },
          {
            title: 'Chorus 1',
            lyrics:
              'You are You are You are the Lord of all\r\nGave Your life to save us\r\nFreedom has embraced us\r\nYou are You are You are the Love for all\r\nHope of every nation\r\nAll creation shouts Your glory',
          },
          {
            title: 'Verse 2',
            lyrics:
              "I'm running with a heart that's changed\r\nEverything to see Your kingdom come\r\nYou guide every step I take\r\nI'm not ashamed to shout who You are\r\nI'm living in a brand new day\r\nA life to give a life to lift You high\r\nAll glory and power and praise\r\nTo You alone to You alone",
          },
          {
            title: 'Bridge',
            lyrics:
              "I'm not ashamed of who You are\r\nYour love broke through\r\nAnd grace has made me Yours\r\nNow upon this Rock I stand\r\nIn victory in victory\r\n(REPEAT 3X)\r\n",
          },
        ],
      });
    });

    it('should return a song for a SPANISH SongShow Plus 7 file1', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongShowPlusSpanishFile1);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Devuelveme El Gozo',
        info: [
          {
            name: 'Keywords',
            value: 'Tahoma, ?',
          },
        ],
        slides: [
          {
            title: 'Verse 1©',
            lyrics:
              'En medio del dolor \r\nEn medio de la aflicciÃ³n\r\nTu me das paz y \r\nMe enseÃ±as tu amor \r\nTodo lo que perdÃ­ \r\nLo restauras SeÃ±or en mi \r\nMe das las fuerza para seguir',
          },
          {
            title: 'Chorus',
            lyrics:
              'Devuelve me el gozo \r\nDe Tu salvaciÃ³n y\r\nTu EspÃ­ritu noble me sustente \r\nTe necesito Dios \r\nSin ti no soy nada \r\nTe necesito Dios \r\nDame un nuevo corazÃ³n\r\n"',
          },
        ],
      });
    });

    it('should return a song for a SPANISH SongShow Plus 7 file2', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongShowPlusSpanishFile2);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'La Sangre (The Blood)',
        info: [
          {
            name: 'Keywords',
            value: 'Background Improv',
          },
        ],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              'La sangre de mi Cristo\r\nque el vertio por mi en la cruz\r\naun es eficaz, para limpiar tu ser\r\nporque Cristo nunca perdera su fuerza',
          },
          {
            title: 'Chorus',
            lyrics:
              'Oh, porque alcanza a limpiar nuestras manchas\r\ny alcanza a curar nuestras llagas\r\npecador ven al manantial \r\nque fluyendo esta\r\ny lavara tu ser\r\nporque Cristo nunca perdera su fuerza!!"',
          },
        ],
      });
    });
  });
});
