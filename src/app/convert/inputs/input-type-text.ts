import { IRawDataFile } from 'src/app/convert/models/file.model';
import { IInputConverter } from './input-converter.model';
import { ISong } from 'src/app/convert/models/song.model';

export class InputTypeText implements IInputConverter {
  name = 'plain-text';
  fileExt = 'txt';

  constructor() {}

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    //just test the file extension for now
    //TODO: Test to make sure this is NOT ChordPro or SongPro!
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
