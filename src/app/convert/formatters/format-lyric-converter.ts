import { IRawDataFile } from 'src/app/shared/file.model';
import { IFormat } from './format.model';
import { ISong } from 'src/app/shared/song.model';

export class FormatLyricConverter implements IFormat {
  friendlyName = 'Lyric Converter';
  friendlyFileExt = 'json';

  constructor() {}

  testFormat = (rawFile: IRawDataFile): boolean => {
    //just test the file extension
    return /^json$/.test(rawFile.ext);
  };

  convert = (rawFile: IRawDataFile): ISong => {
    try {
      //If this JSON object was generated from LyricConverter
      //we should just be able to pass it right on through!
      const parsed: ISong = JSON.parse(rawFile.data);

      return {
        fileName: rawFile.name,
        title: parsed.title || '',
        info: parsed.info && parsed.info.length ? parsed.info : [],
        slides: parsed.slides && parsed.slides.length ? parsed.slides : [],
      };
    } catch (ex) {
      return {
        fileName: rawFile.name,
        title: '',
        info: [],
        slides: [],
      };
    }
  };
}
