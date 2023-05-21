import { XMLParser } from 'fast-xml-parser';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';
import {
  IOpenLyricsDocAuthors,
  IOpenLyricsDocComments,
  IOpenLyricsDocLyrics,
  IOpenLyricsDocProperties,
  IOpenLyricsDocRoot,
  IOpenLyricsDocSongBooks,
  IOpenLyricsDocTempo,
  IOpenLyricsDocThemes,
  IOpenLyricsDocTitles,
} from '../models/openlyrics-document.model';
import { STRING_LIST_SEPARATOR_JOIN } from '../shared/constants';

export class InputTypeOpenLyrics implements IInputConverter {
  name = 'OpenLyrics';

  doesInputFileMatchThisType(file: IRawDataFile): boolean {
    return file.ext.toLowerCase() === 'xml';
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    //When certain XML nodes only have one item the parser will convert them into objects
    //Here we maintain a list of node paths to always keep as arrays
    //This keeps our code structure and typedefs more sane and normalized
    const alwaysArray = [
      'song.properties.titles.title',
      'song.properties.authors.author',
      'song.properties.comments.comment',
      'song.properties.songbooks.songbook',
      'song.properties.themes.theme',
      'song.lyrics.verse',
      'song.lyrics.verse.lines',
    ];

    const xmlParser = new XMLParser({
      //https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
      ignoreAttributes: false,
      ignoreDeclaration: true,
      attributeNamePrefix: '',
      parseAttributeValue: true,
      stopNodes: ['song.lyrics.verse.lines'],
      isArray: (_name, jPath: string) => alwaysArray.includes(jPath),
      tagValueProcessor: (_tagName, tagValue, jPath): string | null => {
        return jPath === 'song.lyrics.verse.lines' ? tagValue : null;
      },
    });

    const parsedDoc: IOpenLyricsDocRoot = xmlParser.parse(rawFile.data);
    const title = this.getTitle(parsedDoc.song.properties.titles, rawFile.name);
    const info: ISongInfo[] = this.getInfo(parsedDoc.song.properties);
    const slides: ISongSlide[] = this.getSlides(parsedDoc.song.lyrics);

    // console.group(title);
    // console.log(info);
    // console.log(slides);
    // console.groupEnd();

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }

  private convertHtmlLineBreaksAndStripTags(str: string): string {
    //replace correctly and incorrectly formatted <br> </br> and </br> tags with new lines
    //Then remove all HTML/XML tags
    return str.replace(/<\/?br\/?>/gi, '\n').replace(/<.+?>/g, '');
  }

  private getTitle(titles: IOpenLyricsDocTitles | undefined, fallbackFileName: string): string {
    //Multiple titles can exist (usually for multi-language songs).
    //For simplicity we'll just take the first one
    //It might be a string, but it might be an object if the <title> node has properties on it
    if (titles) {
      const firstTitle = titles.title[0];
      if (firstTitle !== undefined) {
        if (typeof firstTitle === 'string') {
          return firstTitle;
        } else if (Object.prototype.hasOwnProperty.call(firstTitle, '#text')) {
          return firstTitle['#text'];
        }
      }
    }
    return fallbackFileName;
  }

  private getInfo(properties: IOpenLyricsDocProperties): ISongInfo[] {
    let info: ISongInfo[] = [];

    //Special parsing for a few different kinds of properties that might exist
    if (properties.authors) {
      info.push(this.getSpecialPropAuthors(properties.authors));
    }
    if (properties.comments) {
      info = info.concat(this.getSpecialPropComments(properties.comments));
    }
    if (properties.songbooks) {
      info = info.concat(this.getSpecialPropSongBooks(properties.songbooks));
    }
    if (properties.tempo) {
      info.push(this.getSpecialPropsTempo(properties.tempo));
    }
    if (properties.themes) {
      info.push(this.getSpecialPropsThemes(properties.themes));
    }

    //Now we just add the rest of the properties to the info,
    info = info.concat(this.getRegularProps(properties));

    return info;
  }

  private getSlides(lyrics: IOpenLyricsDocLyrics): ISongSlide[] {
    const slides: ISongSlide[] = [];

    if (lyrics.verse) {
      for (const verse of lyrics.verse) {
        let title = verse.name;

        //If we have a language, mark the slide title with it
        if (verse.lang !== undefined && verse.translit !== undefined) {
          //Both a Language and a Transliteration language set, use both
          title += ` (${verse.lang} - transliterated in ${verse.translit})`;
        } else if (verse.lang !== undefined) {
          //Only a language set
          title += ` (${verse.lang})`;
        }

        //Each verse has multiple lines.
        //We combine all lines and strip out any XML tags (chord markers, comments, )
        const slideLyrics = verse.lines
          .map((l) => {
            return this.convertHtmlLineBreaksAndStripTags(this.getStringOrTextProp(l));
          })
          //Combine all lines into a single string
          .join('\n')
          //Then remove all whitespace after a new line (these were indentations in the XML)
          .replace(/\n[\t ]+/g, '\n')
          .trim();

        //Don't add empty slides
        if (slideLyrics !== '') {
          slides.push({ title, lyrics: slideLyrics });
        }
      }
    }

    return slides;
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  private getStringOrTextProp(str: string | { '#text': string }): string {
    if (typeof str === 'string') {
      return str;
    }
    return str['#text'];
  }

  private getSpecialPropAuthors(authors: IOpenLyricsDocAuthors): ISongInfo {
    let name = 'Author';
    if (authors.author.length > 1) name += 's';
    const authorNamesArr = authors.author.map(this.getStringOrTextProp);
    return { name, value: authorNamesArr.join(STRING_LIST_SEPARATOR_JOIN) };
  }

  private getSpecialPropComments(comments: IOpenLyricsDocComments): ISongInfo[] {
    const commentInfoArr: ISongInfo[] = [];
    const name = 'Comment';
    if (comments.comment.length === 1) {
      //Just one comment
      commentInfoArr.push({ name, value: this.getStringOrTextProp(comments.comment[0]!) });
    } else {
      //Multiple comments added as separate infos with numbered names
      for (let i = 0; i < comments.comment.length; i++) {
        const comment = comments.comment[i]!;
        commentInfoArr.push({ name: `${name} ${i + 1}`, value: this.getStringOrTextProp(comment) });
      }
    }

    return commentInfoArr;
  }

  private getSpecialPropSongBooks(songBooks: IOpenLyricsDocSongBooks): ISongInfo[] {
    const songBookInfoArr: ISongInfo[] = [];
    const name = 'Song Book';
    if (songBooks.songbook.length === 1) {
      //Just one song book
      let sbVal = songBooks.songbook[0]?.name!;
      if (songBooks.songbook[0]?.entry !== undefined) {
        sbVal += ` (entry ${songBooks.songbook[0].entry})`;
      }
      songBookInfoArr.push({ name, value: sbVal });
    } else {
      //Multiple comments added as separate infos with numbered names
      for (let i = 0; i < songBooks.songbook.length; i++) {
        const sb = songBooks.songbook[i]!;
        let sbVal = sb.name;
        if (sb.entry !== undefined) {
          sbVal += ` (entry ${sb.entry})`;
        }
        songBookInfoArr.push({ name: `${name} ${i + 1}`, value: sbVal });
      }
    }

    return songBookInfoArr;
  }

  private getSpecialPropsTempo(tempo: IOpenLyricsDocTempo): ISongInfo {
    return { name: 'Tempo', value: tempo['#text'] + tempo.type };
  }

  private getSpecialPropsThemes(themes: IOpenLyricsDocThemes): ISongInfo {
    const name = 'Themes';
    const themesArr = themes.theme.map(this.getStringOrTextProp);
    return { name, value: themesArr.join(STRING_LIST_SEPARATOR_JOIN) };
  }

  private getRegularProps(properties: IOpenLyricsDocProperties): ISongInfo[] {
    const regularProps: ISongInfo[] = [];
    //Add it if it has a string or a number value
    //but skip the ones we've already elsewhere or ones we just don't care about
    const skipProps = ['version'];
    for (const key of Object.keys(properties)) {
      if (
        !skipProps.includes(key) &&
        (typeof properties[key] === 'string' || typeof properties[key] === 'number')
      ) {
        regularProps.push({ name: key, value: properties[key] });
      }
    }

    return regularProps;
  }
}
