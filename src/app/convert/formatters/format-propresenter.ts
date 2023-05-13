import { IRawDataFile } from 'src/app/shared/file.model';
import { ISong } from 'src/app/shared/song.model';
import { IFormat } from './format.model';

export class FormatProPresenter implements IFormat {
  friendlyName = 'Pro Presenter';
  friendlyFileExt = 'pro*'

  constructor() {}

  testFormat = (rawFile: IRawDataFile): boolean => {
    //just test the file extension for any numbered version
    return /^pro\d$/.test(rawFile.ext);
  };

  convert = (rawFile: IRawDataFile): ISong => {
    return {
      fileName: rawFile.name,
      title: '',
      info: [],
      slides: [],
    };
  };
}
