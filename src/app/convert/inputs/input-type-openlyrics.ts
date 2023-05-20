import { XMLParser } from 'fast-xml-parser';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';
import {
  IOpenLyricsDocLyrics,
  IOpenLyricsDocProperties,
  IOpenLyricsDocRoot,
  IOpenLyricsDocSong,
  IOpenLyricsDocTitles,
} from '../models/openlyrics-document.model';

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
      isArray: (_name, jPath: string) => alwaysArray.indexOf(jPath) !== -1,
      tagValueProcessor: (_tagName, tagValue, jPath) => {
        if (jPath === 'song.lyrics.verse.lines') {
          return tagValue;
        }

        return null;
      },
    });

    const parsedDoc: IOpenLyricsDocRoot = xmlParser.parse(rawFile.data);
    const title = this.getTitle(parsedDoc.song.properties.titles, rawFile.name);
    const info: ISongInfo[] = this.getInfo(parsedDoc.song.properties);
    const slides: ISongSlide[] = this.getSlides(parsedDoc.song.lyrics);

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }

  private stripTags(str: string): string {
    //replace correctly and incorrectly formatted <br> </br> and </br> tags with new lines
    //Then remove all HTML/XML tags
    return str.replace(/<\/?br\/?>/gi, '\n').replace(/<.+?>/g, '')
  }

  private getTitle(_titles: IOpenLyricsDocTitles, fallbackFileName: string): string {
    return fallbackFileName;
  }

  private getInfo(_properties: IOpenLyricsDocProperties): ISongInfo[] {
    const info: ISongInfo[] = [];

    return info;
  }

  private getSlides(_lyrics: IOpenLyricsDocLyrics): ISongSlide[] {
    const slides: ISongSlide[] = [];
    console.log(_lyrics.verse);
    return slides;
  }
}
