import { IRawDataFile } from 'src/app/convert/models/file.model';
import { IInputConverter } from './input-converter.model';
import { ISong, ISongInfo, ISongSlide } from 'src/app/convert/models/song.model';
import { Utils } from '../shared/utils';
import { LyricConverterError } from '../models/errors.model';

export class InputTypePlainText implements IInputConverter {
  readonly name = 'Plain Text';
  readonly fileExt = 'txt';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    return rawFile.ext.toLowerCase() === this.fileExt;
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    let title = rawFile.name; //default/fallback name
    let info: ISongInfo[] = [];
    let slides: ISongSlide[] = [];
    //The info and the lyrics are separated by 3 newline characters
    const parts = Utils.normalizeLineEndings(rawFile.data).split('\n\n\n');
    if (parts.length === 2 && parts[0] != null && parts[1] != null) {
      info = this.getSongInfo(parts[0]);
      if (info[0]?.name.toLowerCase() === 'title') {
        title = info[0].value.toString();
        info = info.slice(1);
      }
      slides = this.getSongLyrics(parts[1]);
    } else {
      throw new LyricConverterError(
        `This ${this.name} file is not formatted correctly. It needs to have 2 blank lines between the info at the top and the lyrics so they can be differentiated.`
      );
    }

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }

  private getSongInfo(infoContent: string): ISongInfo[] {
    const info: ISongInfo[] = [];

    for (const line of infoContent.split('\n')) {
      const lineParts = line.split(':');
      if (lineParts[0] != null && lineParts[1] != null) {
        info.push({ name: lineParts[0].trim(), value: lineParts[1].trim() });
      }
    }

    return info;
  }

  private getSongLyrics(lyricsContent: string): ISongSlide[] {
    const slides: ISongSlide[] = [];

    for (const section of lyricsContent.split('\n\n')) {
      const lines = section.split('\n');
      let title = '';
      let lyrics = section;
      //the first line always exists, even in an empty file!
      const firstLine = lines[0]!; //eslint-disable-line @typescript-eslint/no-non-null-assertion
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
