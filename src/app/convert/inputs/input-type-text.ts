import { IRawDataFile } from 'src/app/convert/models/file.model';
import { IInputConverter } from './input-converter.model';
import { ISong } from 'src/app/convert/models/song.model';

export class InputTypeText implements IInputConverter {
  readonly name = 'Plain Text';

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    //Test the file extension, and make sure the content is NOT formatter like ChordPro
    //TODO: Test to make sure this is NOT SongPro!
    return /^txt$/.test(rawFile.ext)&& !/^.*{.+:.+}\s+/i.test(rawFile.data);
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
