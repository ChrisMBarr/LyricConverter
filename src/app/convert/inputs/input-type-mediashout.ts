import { mockStaticTimestamp } from '../../../../test/mock-song-objects';
import { version } from '../../version';
import { IRawDataFile } from '../models/file.model';
import {
  IMediaShoutLyricPart,
  IMediaShoutLyrics,
  IMediaShoutRootDoc,
} from '../models/mediashout.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

export class InputTypeMediaShout implements IInputConverter {
  readonly name = 'MediaShout';
  readonly fileExt = 'json';
  readonly url = 'https://mediashout.com';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    try {
      //Make sure this does contain a property that MediaShout JSON file would contain
      const parsed = JSON.parse(rawFile.dataAsString) as IMediaShoutRootDoc;
      return rawFile.ext.toLowerCase() === this.fileExt && typeof parsed.Folders !== 'undefined';
    } catch {
      return false;
    }
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const parsedDoc = JSON.parse(rawFile.dataAsString) as IMediaShoutRootDoc;

    //TODO: Not sure why this is an array, can there be multiple songs in a file?
    const firstFolderLyrics = parsedDoc.Folders[0]?.Lyrics[0];

    let title = firstFolderLyrics?.Title;
    if (title == null || title === '') title = rawFile.name;

    return {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      lyricConverterVersion: version,
      timestamp: mockStaticTimestamp,
      title,
      info: firstFolderLyrics ? this.getInfo(firstFolderLyrics) : [],
      slides: this.getSlides(firstFolderLyrics?.LyricParts ?? []),
    };
  }

  private getInfo(props: IMediaShoutLyrics): Array<ISongInfo> {
    const info: Array<ISongInfo> = [];

    this.addStringPropValue(info, props, 'CCLI Number', 'cclid');
    this.addStringPropValue(info, props, 'Copyrights', 'copyrights');
    this.addStringPropValue(info, props, 'Disclaimer', 'Disclaimer');
    this.addStringPropValue(info, props, 'Song ID', 'songId');
    this.addStringPropValue(info, props, 'Song Number', 'SongNumber');
    this.addStringPropValue(info, props, 'Authors', 'Authors');

    return info;
  }

  private addStringPropValue(
    arr: Array<ISongInfo>,
    props: IMediaShoutLyrics,
    infoName: string,
    propKey: keyof Omit<IMediaShoutLyrics, 'LyricParts'>,
  ): void {
    const val = props[propKey];
    if ((typeof val === 'string' || typeof val === 'number') && val !== '') {
      arr.push({ name: infoName, value: val });
    } else if (Array.isArray(val)) {
      // val.forEach((item) => {
      //   //TODO: What are possible values here?
      // });
    }
  }

  private getSlides(slidesArr: Array<IMediaShoutLyricPart>): Array<ISongSlide> {
    const slidesList: Array<ISongSlide> = [];

    for (const slide of slidesArr) {
      const title = slide.PartLabel ?? slide.PartType.toString();
      //combine text of multiple text elements on a single slide
      const lyrics = slide.Lyrics;
      if (title !== '' || lyrics !== '') {
        slidesList.push({ title, lyrics });
      }
    }

    return slidesList;
  }
}
