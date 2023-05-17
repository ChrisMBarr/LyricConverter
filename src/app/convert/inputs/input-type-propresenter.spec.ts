import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeProPresenter } from './input-type-propresenter';
import * as mockPpFiles from 'test/mock-propresenter-files';
import { dedent, deepClone } from 'test/test-utils';

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

  describe('stripRtf()', () => {
    it('should get single line plain text from an RTF string', () => {
      expect(
        inputConverter.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1343\\cocoasubrtf140\n\\cocoascreenfonts1{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\pardirnatural\\qc\n\n\\f0\\fs260 \\cf1 \\expnd0\\expndtw0\\kerning0\n\\outl0\\strokewidth0 \\strokec0 Our Good }'
        )
      ).toEqual(`Our Good`);
    });

    it('should get multiline plain text from an RTF string 1', () => {
      expect(
        inputConverter.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1038\\cocoasubrtf320\n{\\fonttbl\\f0\\fswiss\\fcharset0 Impact;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\qc\\pardirnatural\n\n\\f0\\fs120 \\cf1 \\outl0\\strokewidth-40 \\strokec0 We bow our hearts we bend our knees\\\nOh Spirit come make us humble\\\nWe turn our eyes from evil things\\\nOh Lord we cast down our idols}'
        )
      ).toEqual(dedent`We bow our hearts we bend our knees
                       Oh Spirit come make us humble
                       We turn our eyes from evil things
                       Oh Lord we cast down our idols`);
    });

    it('should get multiline plain text from an RTF string 2', () => {
      expect(
        inputConverter.stripRtf(
          '{\\rtf1\\ansi\\ansicpg1252\\cocoartf1343\\cocoasubrtf140\n\\cocoascreenfonts1{\\fonttbl\\f0\\fswiss\\fcharset0 Helvetica;}\n{\\colortbl;\\red255\\green255\\blue255;}\n\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\pardirnatural\\qc\n\n\\f0\\fs260 \\cf1 \\outl0\\strokewidth0 \\strokec1 Give us clean hands\\\nGive us pure hearts\\\nLet us not lift our\\\nSouls to another}'
        )
      ).toEqual(dedent`Give us clean hands
                       Give us pure hearts
                       Let us not lift our
                       Souls to another`);
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
        const fileCopy = deepClone(mockPpFiles.pp4File1);
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

      it('should get the expected SLIDES from a ProPresenter 4 file1', () => {
        expect(inputConverter.extractSongData(mockPpFiles.pp4File1).slides).toEqual([
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
        ]);
      });

      it('should get the expected SLIDES from a ProPresenter 4 file2', () => {
        expect(inputConverter.extractSongData(mockPpFiles.pp4File2).slides).toEqual([
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
        const fileCopy = deepClone(mockPpFiles.pp5File1);
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

      it('should get the expected SLIDES from a ProPresenter 5 file1', () => {
        expect(inputConverter.extractSongData(mockPpFiles.pp5File1).slides).toEqual([
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
            lyrics:
              'For dark is light to You\nDepths are Height to you\nFar is near\nBut Lord I need to hear from You',
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
        ]);
      });

      it('should get the expected SLIDES from a ProPresenter 5 file2', () => {
        expect(inputConverter.extractSongData(mockPpFiles.pp5File2).slides).toEqual([
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
            lyrics:
              'Give us clean hands\nGive us pure hearts\nLet us not lift our\nSouls to another',
          },
          {
            title: 'Chorus',
            lyrics:
              'Oh God let us be\nA generation that seeks\nThat seeks Your face\nOh God of Jacob',
          },
          {
            title: '*blank*',
            lyrics: '',
          },
        ]);
      });

      it('should get the expected SLIDES from a ProPresenter 5 file2 when a slide has a title but no lyrics', () => {
        expect(
          inputConverter.extractSongData(mockPpFiles.pp5File3OneSlideWithLyricsAndNoName).slides
        ).toEqual([
          {
            title: '',
            lyrics: 'We bow our hearts\nWe bend our knees\nOh Spirit come\nMake us humble',
          },
        ]);
      });
    });
  });
});
