import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

export class InputTypeSongShowPlus7 implements IInputConverter {
  name = 'SongShow Plus 7';

  doesInputFileMatchThisType(file: IRawDataFile): boolean {
    //TODO: Determine a way to check the version or if that's even important!
    return file.ext.toLowerCase() === 'sbsong';
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const title = rawFile.name; //default/fallback name
    const info: ISongInfo[] = [];
    const slides: ISongSlide[] = [];

    console.log(rawFile)

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }
}
