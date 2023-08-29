import {
  mockEmptySongProFile,
  mockEmptyTextFile,
  mockSimpleChordProFile,
} from 'test/mock-raw-files';
import { TestUtils } from 'test/test-utils';
import { IRawDataFile } from '../models/file.model';
import { InputTypeSongPro } from './input-type-songpro';
import { mockSongProFile1, mockSongProFile2 } from 'test/mock-songpro-files';

describe('InputTypeSongPro', () => {
  let inputConverter: InputTypeSongPro;

  beforeEach(() => {
    inputConverter = new InputTypeSongPro();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  describe('doesInputFileMatchThisType()', () => {
    it('should properly ACCEPT a SongPro file when tested', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockEmptySongProFile);
      expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
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
    it('should return a song for a SongPro file1', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongProFile1);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Escape Capsule',
        info: [
          { name: 'artist', value: 'Brian Kelly' },
          { name: 'bandcamp', value: 'https://spilth.bandcamp.com/track/escape-capsule' },
        ],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              "Climb a-board \nI've been waiting for you \nClimb a-board \nYou'll be safe in here",
          },
          {
            title: 'Chorus 1',
            lyrics: "I'm a rocket made for your pro-tection\nYou're safe with me, un-til you leave",
          },
        ],
      });
    });

    it('should return a song for a SongPro file2', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongProFile2);

      expect(inputConverter.extractSongData(testFile)).toEqual({
        fileName: testFile.name,
        title: 'Bad Moon Rising',
        info: [
          { name: 'artist', value: 'Creedence Clearwater Revival' },
          { name: 'capo', value: '1' },
          { name: 'difficulty', value: 'Easy' },
          {
            name: 'spotify_url',
            value:
              'https://open.spotify.com/track/20OFwXhEXf12DzwXmaV7fj?si=cE76lY5TT26fyoNmXEjNpA',
          },
        ],
        slides: [
          {
            title: 'Verse 1',
            lyrics:
              "I see a bad moon a-rising\nI see trouble on the way\nI see earth-quakes and lightnin'\nI see bad times to-day",
          },
          {
            title: 'Chorus',
            lyrics:
              "Don't go 'round tonight\nIt's bound to take your life\nThere's a bad moon on the rise",
          },
          {
            title: 'Verse 2',
            lyrics:
              'I hear hurri-canes a-blowing\nI know the end is coming soon\nI fear rivers over flowing\nI hear the voice of rage and ruin',
          },
          {
            title: 'Chorus',
            lyrics:
              "Don't go 'round tonight\nIt's bound to take your life\nThere's a bad moon on the rise",
          },
          {
            title: 'Verse 3',
            lyrics:
              "I hope you got your things to-gether\nHope you are quite pre-pared to die\nLook's like we're in for nasty weather\nOne eye is taken for an eye",
          },
          {
            title: 'Chorus',
            lyrics:
              "Oh don't go 'round tonight\nIt's bound to take your life\nThere's a bad moon on the rise\nThere's a bad moon on the rise",
          },
        ],
      });
    });

    it('should use the filename as the title when a title is not present in the file', () => {
      const testFile: IRawDataFile = TestUtils.deepClone(mockSongProFile1);
      testFile.name = 'My Test Title';
      testFile.dataAsString = testFile.dataAsString.replace(/^@title=.+/i, '');
      expect(inputConverter.extractSongData(testFile).title).toEqual(testFile.name);
    });
  });
});
