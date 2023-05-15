import { IOutputFile } from '../models/file.model';
import { ISong } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeText implements IOutputConverter {
  readonly friendlyName = 'Text';
  readonly friendlyFileExt = 'txt';

  convertToType(song: ISong): IOutputFile {
    const newLine = '\n';
    const blankLine = newLine + newLine;

    let fileContent = 'Title: ' + song.title;

    //Loop through the song info attributes
    for (const info of song.info) {
      if (info.name.trim().length > 0 && info.value.trim().length > 0) {
        fileContent += newLine;
        fileContent += info.name + ': ' + info.value;
      }
    }

    fileContent += blankLine;

    //Add the song lyrics
    for (const slide of song.slides) {
      //Skip blank slides for text files
      if (slide.title.trim().length > 0 || slide.lyrics.trim().length > 0) {
        fileContent += slide.title;
        fileContent += newLine;
        fileContent += slide.lyrics.trim();
        fileContent += blankLine;
      }
    }

    return {
      songData: song,
      fileName: `${song.fileName}.${this.friendlyFileExt}`,
      outputContent: fileContent.trim(), //remove any trailing whitespace
    };
  }
}
