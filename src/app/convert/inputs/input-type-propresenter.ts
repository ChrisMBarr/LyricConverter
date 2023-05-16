import { IRawDataFile } from 'src/app/convert/models/file.model';
import { ISong } from 'src/app/convert/models/song.model';
import { IInputConverter } from './input-converter.model';

export class InputTypeProPresenter implements IInputConverter {
  readonly name = 'ProPresenter';
  readonly fileExt = 'pro*'

  constructor() {}

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    //just test the file extension for any numbered version
    return /^pro\d$/.test(rawFile.ext);
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
