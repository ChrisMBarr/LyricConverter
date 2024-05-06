import { mockStaticTimestamp } from '../../../../test/mock-song-objects';
import { version } from '../../version';
import { IRawDataFile } from '../models/file.model';
import {
  IMediaShoutLyricPart,
  IMediaShoutLyrics,
  IMediaShoutRootDoc,
  MediaShoutPartTypeEnum,
} from '../models/mediashout.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

//TODO: Deal with multiple songs in the same file?
//TODO: Throw custom error when .sc7x files are attempted

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
    } else if (Array.isArray(val) && val.length > 0) {
      arr.push({ name: infoName, value: val.join(', ') });
    }
  }

  private getSlides(slidesArr: Array<IMediaShoutLyricPart>): Array<ISongSlide> {
    const slidesList: Array<ISongSlide> = [];

    for (const slide of slidesArr) {
      if (slide.Lyrics !== '') {
        slidesList.push({ title: this.getSlideTitle(slide), lyrics: slide.Lyrics });
      }
    }

    return slidesList;
  }

  private getSlideTitle(slide: IMediaShoutLyricPart): string {
    let label = '';

    //prefer the label if provided, otherwise look up the part type from the enum
    if (slide.PartLabel != null) {
      label = slide.PartLabel;
    } else {
      //look up the name from the enum, then transform PascalCase kebab-case: "PreChorus" => "Pre-Chorus"
      label = MediaShoutPartTypeEnum[slide.PartType].replace(
        /[A-Z]+(?![a-z])|[A-Z]/g,
        (str, ofs: number) => (ofs > 0 ? '-' : '') + str,
      );
    }

    return `${label} ${slide.PartTypeNumber.toString()}`;
  }
}
