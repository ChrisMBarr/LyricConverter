import { version } from '../../version';
import { LyricConverterError } from '../models/errors.model';
import { IRawDataFile } from '../models/file.model';
import { ISong } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

/**@description This is for reading LyricConverter JSON files. Probably not used very often, but useful if you want to convert songs to JSON first, edit them easily, and then convert them to something else */
export class InputTypeJSON implements IInputConverter {
  readonly name = 'JSON';
  readonly fileExt = 'json';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    try {
      //Make sure this does not contain any properties that a MediaShout JSON file would contain
      const parsed = JSON.parse(rawFile.dataAsString) as Record<string, unknown>;
      return rawFile.ext.toLowerCase() === this.fileExt && typeof parsed['Folders'] === 'undefined';
    } catch {
      return false;
    }
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const returnSong: ISong = {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      outputFileName: rawFile.name, //song inputs are a one-to-one relationship for LyricConverter JSON, so the file name does not change when converting
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
