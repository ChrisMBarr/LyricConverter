import { IOutputFile } from '../models/file.model';
import { ISong } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeJSON implements IOutputConverter {
  readonly name = 'JSON';
  readonly fileExt = 'json';

  convertToType(song: ISong): IOutputFile {
    //Just convert the object to a string, but leave off the fileName property
    const jsonString = JSON.stringify(
      {
        title: song.title,
        info: song.info,
        slides: song.slides,
      },
      null,
      2,
    );

    return {
      songData: song,
      fileName: `${song.outputFileName}.${this.fileExt}`,
      outputContent: jsonString,
    };
  }
}
