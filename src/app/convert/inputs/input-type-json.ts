import { IRawDataFile } from 'src/app/convert/models/file.model';
import { IInputConverter } from './input-converter.model';
import { ISong } from 'src/app/convert/models/song.model';

export class InputTypeJSON implements IInputConverter {
  readonly name = 'JSON';
  readonly fileExt = 'json';

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    return rawFile.ext.toLowerCase() === this.fileExt;
  };

  extractSongData = (rawFile: IRawDataFile): ISong => {
    const returnSong: ISong = {
      fileName: rawFile.name,
      title: '',
      info: [],
      slides: [],
    };

    try {
      //This JSON object was probably generated from LyricConverter
      //we should just be able to pass it right on through!
      const parsed: ISong | object = JSON.parse(rawFile.data);

      if (this.isSongObject(parsed)) {
        returnSong.title = parsed.title;
        returnSong.info = parsed.info;
        returnSong.slides = parsed.slides;
      }

      return returnSong;
    } catch (ex) {
      return returnSong;
    }
  };

  private isSongObject(possibleSong: ISong | object): possibleSong is ISong {
    return (
      Object.prototype.hasOwnProperty.call(possibleSong, 'title') &&
      Object.prototype.hasOwnProperty.call(possibleSong, 'info') &&
      Object.prototype.hasOwnProperty.call(possibleSong, 'slides')
    );
  }
}
