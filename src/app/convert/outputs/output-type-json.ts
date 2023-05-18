import { ISong } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeJSON implements IOutputConverter {
  name = 'JSON';
  fileExt = 'json';
  convertToType = (song: ISong) => {
    //Just convert the object to a string, but leave off the fileName property
    const jsonString = JSON.stringify(
      {
        title: song.title,
        info: song.info,
        slides: song.slides,
      },
      null,
      2
    );

    return {
      songData: song,
      fileName: `${song.fileName}.${this.fileExt}`,
      outputContent: jsonString,
    };
  };
}
