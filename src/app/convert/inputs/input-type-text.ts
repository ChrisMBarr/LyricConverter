import { IRawDataFile } from 'src/app/convert/models/file.model';
import { IInputConverter } from './input-converter.model';
import { ISong } from 'src/app/convert/models/song.model';

export class InputTypeText implements IInputConverter {
  readonly name = 'Plain Text';

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    //TODO: Test to make sure this is NOT SongPro!
    return /^txt$/.test(rawFile.ext);
  };

  extractSongData = (rawFile: IRawDataFile): ISong => {
    return {
      fileName: rawFile.name,
      title: '',
      info: [],
      slides: [],
    };
  };
}
