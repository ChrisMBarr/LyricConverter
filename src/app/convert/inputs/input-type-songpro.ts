import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';
import { ISongProSong, SongPro, ISongProLine } from 'songpro';
import { Utils } from '../shared/utils';

export class InputTypeSongPro implements IInputConverter {
  readonly name = 'SongPro';
  readonly fileExt = 'sng';
  readonly url = 'https://songpro.org/';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    //There are not a lot of examples of this file format online,
    // it's not clear which file extension is commonly used,
    // but since there's no overlap with other formats in this
    // project we can just check for either one
    const lowerCaseExt = rawFile.ext.toLowerCase();
    return lowerCaseExt === this.fileExt || lowerCaseExt === 'md';
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const song = SongPro.parse(Utils.normalizeLineEndings(rawFile.data));

    const title = song.attrs.title ?? rawFile.name;
    const info: ISongInfo[] = this.getSongInfo(song);
    const slides: ISongSlide[] = this.getSongSlides(song);

    // console.group(title);
    // console.log('Song Object', song);
    // console.log('Info', info);
    // console.log('Slides', slides);
    // console.groupEnd();

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }

  private getSongInfo(song: ISongProSong): ISongInfo[] {
    const info: ISongInfo[] = [];

    for (const attrKey of Object.keys(song.attrs)) {
      //add all attributes, except the title, to our array of info
      const attrVal = song.attrs[attrKey];
      if (attrKey !== 'title' && attrVal != null) {
        info.push({ name: attrKey, value: attrVal });
      }
    }

    for (const customAttrKey of Object.keys(song.custom)) {
      //add all custom to our array of info
      const customAttrVal = song.custom[customAttrKey];
      if (customAttrKey !== 'title' && customAttrVal != null) {
        info.push({ name: customAttrKey, value: customAttrVal });
      }
    }

    return info;
  }

  private getSongSlides(song: ISongProSong): ISongSlide[] {
    const slides: ISongSlide[] = [];

    for (const section of song.sections) {
      const lyrics = this.getCombinedLyricsFromLines(section.lines).trim();

      //Don't add blank slides
      if (lyrics !== '') {
        slides.push({
          title: section.name,
          lyrics,
        });
      }
    }

    return slides;
  }

  private getCombinedLyricsFromLines(lines: ISongProLine[]): string {
    //Lines contain objects with partial lyrics and chords.
    //We don't care about the chords so we just join each part
    // together as a single string and then each string as a line of text

    const combinedLyrics = lines
      .map((l) => {
        return l.parts.map((p) => p.lyric).join(' ');
      })
      .join('\n');

    //We need to also remove odd hyphens that remain from how songs
    // were originally written with inner Chords
    //Given this input:
    // [D]I hear [A]hurri-[G]canes a-[D]blowing
    //The parser produces this array:
    /* [
      { chord: 'D', lyric: 'I hear' },
      { chord: 'A', lyric: 'hurri-' },
      { chord: 'G', lyric: 'canes a-' },
      { chord: 'D', lyric: 'blowing' },
    ]*/
    //So, in our combined lyric string
    // whenever we encounter a letter, a hyphen, a space, and another letter
    // we remove the space since there shouldn't be a work break here.
    // It's debatable to remove the hyphen or not. Some words like "a-blowing"
    // need the hyphen kept since it's not a real word. Other like "hurri-canes"
    // might look odd since it's not usually hyphenated, but it's better to keep
    // more data here than to lose it. That also keeps the original syllable break,
    // which is how this song would be sung, and this project is about finding lyrics anyway!
    // This is a lot of comments for such a short function!

    return combinedLyrics.replace(/- /g, '-');
  }
}
