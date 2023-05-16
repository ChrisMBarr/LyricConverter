import { IRawDataFile } from 'src/app/convert/models/file.model';
import { IInputConverter } from './input-converter.model';
import { ISong } from 'src/app/convert/models/song.model';

export class InputTypeLyricConverter implements IInputConverter {
  readonly name = 'LyricConverter';

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    //just test the file extension
    return /^json$/.test(rawFile.ext);
  };

  extractSongData = (rawFile: IRawDataFile): ISong => {
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
