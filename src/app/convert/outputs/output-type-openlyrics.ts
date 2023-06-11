import { OpenLyricsBuilder } from 'openlyrics-parser';
import { INewOpenLyricsSong } from 'openlyrics-parser/dist/main/builder.model';
import { IOutputFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { STRING_LIST_SEPARATOR_JOIN, STRING_LIST_SEPARATOR_SPLIT } from '../shared/constants';
import { IOutputConverter } from './output-converter.model';
import { version } from '../../version';

export class OutputTypeOpenLyrics implements IOutputConverter {
  readonly name = 'OpenLyrics';
  readonly fileExt = 'xml';
  readonly url = 'http://openlyrics.org/';

  convertToType(song: ISong): IOutputFile {
    const songBuildData: INewOpenLyricsSong.IOptions = {
      meta: {
        createdIn: `LyricConverter ${version}`,
        modifiedIn: `LyricConverter ${version}`,
      },
      properties: {
        authors: this.findSpecialPropertyAuthors(song.info),
        ccliNo: this.findPropertyValue(song.info, /(ccliNo)|(CCLI ?Number)/i),
        comments: this.findSpecialPropertyComments(song.info),
        copyright: this.findPropertyValue(song.info, /(year)|(copyright)/i),
        key: this.findPropertyValue(song.info, /^key$/i),
        keywords: this.findPropertyValue(song.info, /^keywords$/i),
        publisher: this.findPropertyValue(song.info, /^publisher$/i),
        released: this.findPropertyValue(song.info, /(year)|(released( ?date)?)/i),
        songBooks: this.findSpecialPropertySongBooks(song.info),
        tempo: this.findSpecialPropertyTempo(song.info),
        themes: this.findSpecialPropertyThemes(song.info),
        timeSignature: this.findPropertyValue(song.info, /time ?signature/i),
        titles: song.title, //only one title
        transposition: this.findPropertyValue(song.info, /^transposition$/i),
        variant: this.findPropertyValue(song.info, /^variant$/i),
        verseOrder: this.findPropertyValue(song.info, /order/i),
      },
      verses: this.findVerses(song.slides),
    };

    const fileContent = OpenLyricsBuilder(songBuildData);

    // console.groupCollapsed(song.title);
    // console.log(song);
    // console.log(fileContent);
    // console.groupEnd();

    return {
      songData: song,
      fileName: `${song.fileName}.${this.fileExt}`,
      outputContent: fileContent,
    };
  }

  private findPropertyValue(info: ISongInfo[], namePattern: RegExp): string | undefined {
    const infoMatch = info.find((i) => namePattern.test(i.name));
    if (infoMatch !== undefined) {
      return infoMatch.value.toString();
    }
    return undefined;
  }

  private findSpecialPropertyAuthors(info: ISongInfo[]): INewOpenLyricsSong.IAuthor[] | undefined {
    const foundAuthors = info.filter((i) => /(artist)|(author)/i.test(i.name));

    if (foundAuthors.length > 0) {
      //Each found value might contain a multi-value string.
      //We combine all of these with the same separator into a single string,
      //and then split it all back out into an array
      return foundAuthors
        .map((a) => a.value)
        .join(STRING_LIST_SEPARATOR_JOIN)
        .split(STRING_LIST_SEPARATOR_SPLIT)
        .map((a) => ({ value: a.trim() }));
    }

    return undefined;
  }

  private findSpecialPropertyTempo(info: ISongInfo[]): string | number | undefined {
    //If we have a property, look for '90' in a string like '90bpm' and then just return the number
    //If no number, just return the text
    const foundProp = this.findPropertyValue(info, /^tempo$/i);
    if (foundProp != null) {
      const match = /(\d+)bpm/i.exec(foundProp);
      if (match?.[1] != null) {
        return parseInt(match[1], 10);
      }
      return foundProp;
    }
    return undefined;
  }

  private findSpecialPropertyThemes(info: ISongInfo[]): INewOpenLyricsSong.ITheme[] | undefined {
    //There should only be one theme item in the info
    const foundTheme = info.find((i) => i.name.toLowerCase().startsWith('theme'));
    if (foundTheme) {
      return foundTheme.value
        .toString()
        .split(STRING_LIST_SEPARATOR_SPLIT)
        .map((t) => ({ value: t.trim() }));
    }

    return undefined;
  }

  private findSpecialPropertyComments(info: ISongInfo[]): string[] | undefined {
    const foundComments = info.filter((c) => c.name.toLowerCase().startsWith('comment'));

    if (foundComments.length > 0) {
      //Each found value might contain a multi-value string.
      //We combine all of these with the same separator into a single string,
      //and then split it all back out into an array
      return foundComments
        .map((a) => a.value)
        .join(STRING_LIST_SEPARATOR_JOIN)
        .split(STRING_LIST_SEPARATOR_SPLIT);
    }

    return undefined;
  }

  private findSpecialPropertySongBooks(
    info: ISongInfo[]
  ): INewOpenLyricsSong.ISongBook[] | undefined {
    const foundSongBooks = info.filter((sb) => /^song ?book/i.test(sb.name));

    if (foundSongBooks.length > 0) {
      return foundSongBooks.map((sb) => {
        let name = sb.value.toString().trim();
        let entry: string | undefined;
        const sbMatch = /^([\w\s]+)(\(:?entry ([0-9a-z]+)\))?$/i.exec(sb.value.toString());

        if (sbMatch?.[1] != null && sbMatch[3] != null) {
          name = sbMatch[1].trim();
          entry = sbMatch[3];
        }

        return { name, entry };
      });
    }

    return undefined;
  }

  private findVerses(songSlides: ISongSlide[]): INewOpenLyricsSong.IVerse[] {
    return songSlides
        //Ignore the slides with no lyrics
      .filter((s) => s.lyrics.trim() !== '')
      .map((s) => {
        let name = s.title;
        let lang: string | undefined;

        //Slides with specified languages have titles like "v1 (de)" or "v2 (en-US)"
        //When we find this pattern we want to extract the language and put it on the correct attribute
        const langMatch = /^(.+?)(?: \(([a-z]{2}(?:-[a-z]{2})?)\))?$/i.exec(s.title);
        if (langMatch?.[1] != null && langMatch[2] != null) {
          name = langMatch[1];
          lang = langMatch[2];
        }

        return {
          name,
          lang,
          lines: [s.lyrics],
        };
      });
  }
}
