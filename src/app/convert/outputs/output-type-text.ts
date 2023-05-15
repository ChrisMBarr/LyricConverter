import { IOutputFile } from '../models/file.model';
import { ISong } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeText implements IOutputConverter {
  readonly friendlyName = 'Text';
  readonly friendlyFileExt = 'txt';

  convertToType(song: ISong): IOutputFile {
    let fileContent = 'Title: ' + song.title;

    //Loop through the song info attributes
    for (const info of song.info) {
      if (info.name.trim().length > 0 && info.value.trim().length > 0) {
        fileContent += '\r\n';
        fileContent += info.name + ': ' + info.value;
      }
    }

    fileContent += '\r\n\r\n';

    //Add the song lyrics
    for (const slide of song.slides) {
      //Skip blank slides for text files
      if (slide.title.trim().length > 0 || slide.lyrics.trim().length > 0) {
        fileContent += slide.title;
        fileContent += '\r\n';
        fileContent += slide.lyrics;
        fileContent += '\r\n\r\n';
      }
    }

    return {
      songData: song,
      file: new File([fileContent], `${song.fileName}.${this.friendlyFileExt}`),
    };
  }
}
