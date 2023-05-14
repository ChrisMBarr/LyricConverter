import { IRawDataFile } from 'src/app/shared/file.model';
import { IFormat } from './format.model';
import { ISong } from 'src/app/shared/song.model';

export class FormatText implements IFormat {
  friendlyName = 'Plain Text';
  friendlyFileExt = 'txt';

  constructor() {}

  testFormat = (rawFile: IRawDataFile): boolean => {
    //just test the file extension for now
    //TODO: Test to make sure this is NOT ChordPro or SongPro!
    return /^txt$/.test(rawFile.ext);
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
