import { IOutputFile } from '../models/file.model';
import { ISong } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeDisplaySlides implements IOutputConverter {
  readonly name = 'Display Slides';

  convertToType(song: ISong): IOutputFile {
    //Nothing to do for this output, just pass it through and make an empty file
    return {
      songData: song,
      fileName: '',
      outputContent: '',
    };
  }
}
