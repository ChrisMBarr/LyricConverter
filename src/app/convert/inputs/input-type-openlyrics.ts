import {
  IParserAuthor,
  IParserProperties,
  IParserSongBook,
  IParserTitle,
  IParserVerse,
  OpenLyricsParser,
} from 'openlyrics-parser';

import { version } from '../../version';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { STRING_LIST_SEPARATOR_JOIN } from '../shared/constants';
import { IInputConverter } from './input-converter.model';

export class InputTypeOpenLyrics implements IInputConverter {
  name = 'OpenLyrics';
  readonly fileExt = 'xml';
  readonly url = 'http://openlyrics.org/';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    return rawFile.ext.toLowerCase() === this.fileExt;
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const parsedDoc = OpenLyricsParser(rawFile.dataAsString);

    const title = this.getTitle(parsedDoc.properties.titles, rawFile.name);
    const info = this.getInfo(parsedDoc.properties);
    const slides = this.getSlides(parsedDoc.verses);

    // console.group(title);
    // console.log(info);
    // console.log(slides);
    // console.groupEnd();

    return {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      outputFileName: rawFile.name, //song inputs are a one-to-one relationship for OpenLyrics, so the file name does not change when converting
      lyricConverterVersion: version,
      timestamp: new Date().toISOString(),
      title,
      info,
      slides,
    };
  }

  private getTitle(titlesArr: Array<IParserTitle>, fallbackName: string): string {
    let title = fallbackName;

    //OpenLyrics songs can have multiple titles. We'll just take the first one if it's there
    if (titlesArr[0] != null) {
      title = titlesArr[0].value;
    }
    return title;
  }

  private getInfo(properties: IParserProperties): Array<ISongInfo> {
    let info: Array<ISongInfo> = [];

    //Add all string properties, skipping a few, and special handling for Tempo
    const skipProperties = ['tempoType', 'version'];
    Object.keys(properties).forEach((prop) => {
      let val = properties[prop];
      if (typeof val === 'string' && val !== '' && !skipProperties.includes(prop)) {
        if (prop === 'tempo') {
          //If the tempoType is "BPM" append it to the tempo
          if (properties.tempoType.toLowerCase() === 'bpm') {
            val += properties.tempoType;
          }
          info.push({ name: 'Tempo', value: val });
        } else {
          info.push({ name: prop, value: val });
        }
      }
    });

    //Handle Author(s)
    if (properties.authors.length > 0) {
      info = info.concat(this.getSpecialPropAuthors(properties.authors));
    }

    //Handle Comment(s)
    if (properties.comments.length > 0) {
      info = info.concat(this.getSpecialPropComments(properties.comments));
    }

    //Handle SongBook(s)
    if (properties.songBooks.length > 0) {
      info = info.concat(this.getSpecialPropSongBooks(properties.songBooks));
    }

    //Handle Theme(s)
    if (properties.themes.length > 0) {
      const themesArr = properties.themes.map((t) => t.value);
      info.push({ name: 'Themes', value: themesArr.join(STRING_LIST_SEPARATOR_JOIN) });
    }

    return info;
  }

  private getSpecialPropAuthors(authors: Array<IParserAuthor>): Array<ISongInfo> {
    const authorsArr: Array<ISongInfo> = [];
    const key = authors.length === 1 ? 'Author' : 'Authors';
    const val = authors
      .map((a) => {
        return a.type === '' ? a.value : `${a.value} (${a.type})`;
      })
      .join(STRING_LIST_SEPARATOR_JOIN);
    authorsArr.push({ name: key, value: val });

    return authorsArr;
  }

  private getSpecialPropComments(comments: Array<string>): Array<ISongInfo> {
    const commentsArr: Array<ISongInfo> = [];
    const key = 'Comment';
    if (comments.length === 1) {
      //Just one comment
      //Just one comment - we know it exists to we can assert that it's not null

      commentsArr.push({ name: key, value: comments[0]! });
    } else {
      //Multiple comments added as separate infos with numbered names
      for (let i = 0; i < comments.length; i++) {
        //of course we know the value here!

        const comment = comments[i]!;
        commentsArr.push({ name: `${key} ${(i + 1).toString()}`, value: comment });
      }
    }
    return commentsArr;
  }

  private getSpecialPropSongBooks(songBooks: Array<IParserSongBook>): Array<ISongInfo> {
    const songBookInfoArr: Array<ISongInfo> = [];
    const name = 'Song Book';
    if (songBooks.length === 1 && songBooks[0] != null) {
      let sbVal = songBooks[0].name;
      if (songBooks[0].entry && songBooks[0].entry !== '') {
        sbVal += ` (entry ${songBooks[0].entry})`;
      }
      songBookInfoArr.push({ name, value: sbVal });
    } else {
      //Multiple comments added as separate infos with numbered names
      for (let i = 0; i < songBooks.length; i++) {
        //of course we know the value here!

        const sb = songBooks[i]!;
        let sbVal = sb.name;
        if (sb.entry !== '') {
          sbVal += ` (entry ${sb.entry})`;
        }
        songBookInfoArr.push({ name: `${name} ${(i + 1).toString()}`, value: sbVal });
      }
    }

    return songBookInfoArr;
  }

  private getSlides(verses: Array<IParserVerse>): Array<ISongSlide> {
    const slides: Array<ISongSlide> = [];

    for (const v of verses) {
      let title = v.name;

      //If we have a language, mark the slide title with it
      if (v.lang !== '' && v.transliteration !== '') {
        //Both a Language and a Transliteration language set, use both
        title += ` (${v.lang} - transliterated in ${v.transliteration})`;
      } else if (v.lang !== '') {
        //Only a language set
        title += ` (${v.lang})`;
      }
      //Each verse has multiple lines.
      //Each line has multiple objects with content. We only care about the text objects
      const slideLyrics = v.lines
        .map((l) => {
          return (
            l.content
              //Only get the text type objects
              .filter((c) => c.type === 'text')
              //only get the values from these objects
              .map((x) => x.value)
              //join this array together as a single string
              .join('')
          );
        })
        //Combine all lines into a single string with newline separators
        .join('\n')
        //Then remove all whitespace after a new line (these were indentations in the XML)
        .replace(/\n[\t ]+/g, '\n')
        .trim();

      //Don't add empty slides
      if (slideLyrics !== '') {
        slides.push({ title, lyrics: slideLyrics });
      }
    }

    return slides;
  }
}
