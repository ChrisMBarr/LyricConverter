import { IRawDataFile } from 'src/app/convert/models/file.model';
import { IInputConverter } from './input-converter.model';
import { ISong } from 'src/app/convert/models/song.model';

export class InputTypeJSON implements IInputConverter {
  readonly name = 'JSON';

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    return rawFile.ext.toLowerCase() === 'json'
  };

  extractSongData = (rawFile: IRawDataFile): ISong => {
    try {
      //If this JSON object was generated from LyricConverter
      //we should just be able to pass it right on through!
      const parsed: ISong = JSON.parse(rawFile.data);

      return {
        fileName: rawFile.name,
        title: parsed.title || '',
        info: parsed.info || [],
        slides: parsed.slides || [],
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
