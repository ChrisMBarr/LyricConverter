import { IOutputFile } from '../models/file.model';
import { ISong } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeText implements IOutputConverter {
  friendlyName = 'Text';
  friendlyFileExt = 'txt';

  convertToType(song: ISong): IOutputFile {
    let fileContent = 'Title: ' + song.title;

    //Loop through the song info attributes
    for (const info of song.info) {
      if (info.name && info.value) {
        fileContent += '\r\n';
        fileContent += info.name + ': ' + info.value;
      }
    }

    fileContent += '\r\n\r\n';

    //Add the song lyrics
    for (const slide of song.slides) {
      //Skip blank slides for text files
      if (slide.title.length > 0 || slide.lyrics.length > 0) {
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
