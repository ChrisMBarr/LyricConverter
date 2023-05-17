import { ISong } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

//NOTE: This Output Type will only be available when built in Development mode!
export class OutputTypeLyricConverter implements IOutputConverter {
  name = 'LyricConverter';
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
