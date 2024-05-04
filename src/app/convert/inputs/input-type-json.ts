import { IInputConverter } from './input-converter.model';
import { IRawDataFile } from 'src/app/convert/models/file.model';
import { ISong } from 'src/app/convert/models/song.model';
import { LyricConverterError } from '../models/errors.model';
import { version } from '../../version';

export class InputTypeJSON implements IInputConverter {
  readonly name = 'JSON';
  readonly fileExt = 'json';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    return rawFile.ext.toLowerCase() === this.fileExt;
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const returnSong: ISong = {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      lyricConverterVersion: version,
      timestamp: new Date().toISOString(),
      title: rawFile.name,
      info: [],
      slides: [],
    };

    //This JSON object was probably generated from LyricConverter
    //we should just be able to pass it right on through!
    const parsed = JSON.parse(rawFile.dataAsString) as ISong;

    if (this.isSongObject(parsed)) {
      returnSong.title = parsed.title;
      returnSong.info = parsed.info;
      returnSong.slides = parsed.slides;
    } else {
      throw new LyricConverterError(
        `This file is not formatted as a LyricConverter ${this.name} file`,
      );
    }

    return returnSong;
  }

  private isSongObject(possibleSong: ISong | object): possibleSong is ISong {
    return (
      Object.hasOwn(possibleSong, 'title') &&
      Object.hasOwn(possibleSong, 'info') &&
      Object.hasOwn(possibleSong, 'slides')
    );
  }
}
