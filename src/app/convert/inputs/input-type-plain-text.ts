import { version } from '../../version';
import { LyricConverterError } from '../models/errors.model';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { Utils } from '../shared/utils';
import { IInputConverter } from './input-converter.model';

export class InputTypePlainText implements IInputConverter {
  readonly name = 'Plain-Text';
  readonly fileExt = 'txt';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    return rawFile.ext.toLowerCase() === this.fileExt;
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    let title = rawFile.name; //default/fallback name
    let info: Array<ISongInfo> = [];
    let slides: Array<ISongSlide> = [];
    //The info and the lyrics are separated by 3 newline characters
    const parts = Utils.normalizeLineEndings(rawFile.dataAsString).split('\n\n\n');
    if (parts.length === 2 && parts[0] != null && parts[1] != null) {
      info = this.getSongInfo(parts[0]);
      if (info[0]?.name.toLowerCase() === 'title') {
        title = info[0].value.toString();
        info = info.slice(1);
      }
      slides = this.getSongLyrics(parts[1]);
    } else {
      throw new LyricConverterError(
        `This ${this.name} file is not formatted correctly. It needs to have 2 blank lines between the info at the top and the lyrics so they can be differentiated.`,
      );
    }

    return {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      outputFileName: rawFile.name, //song inputs are a one-to-one relationship for TXT, so the file name does not change when converting
      lyricConverterVersion: version,
      timestamp: new Date().toISOString(),
      title,
      info,
      slides,
    };
  }

  private getSongInfo(infoContent: string): Array<ISongInfo> {
    const info: Array<ISongInfo> = [];

    for (const line of infoContent.split('\n')) {
      const lineParts = line.split(':');
      if (lineParts[0] != null && lineParts[1] != null) {
        info.push({ name: lineParts[0].trim(), value: lineParts[1].trim() });
      }
    }

    return info;
  }

  private getSongLyrics(lyricsContent: string): Array<ISongSlide> {
    const slides: Array<ISongSlide> = [];

    for (const section of lyricsContent.split('\n\n')) {
      const lines = section.split('\n');
      let title = '';
      let lyrics = section;
      //the first line always exists, even in an empty file!
      const firstLine = lines[0]!;
      if (firstLine.endsWith(':')) {
        title = firstLine.replace(':', '').trim();
        lyrics = lyrics.replace(firstLine + '\n', '').trim();
      }

      slides.push({
        title,
        lyrics,
      });
    }

    return slides;
  }
}
