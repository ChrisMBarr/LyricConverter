import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';
import { IOutputFile } from '../models/file.model';

export class OutputTypeSongPro implements IOutputConverter {
  readonly name = 'SongPro';
  readonly fileExt = 'sng';
  readonly url = 'https://songpro.org/';

  convertToType(song: ISong): IOutputFile {
    const fileContent = this.generateSongProDocument(song);

    // console.log(fileContent);

    return {
      songData: song,
      fileName: `${song.fileName}.${this.fileExt}`,
      outputContent: fileContent,
    };
  }

  private generateSongProDocument(song: ISong): string {
    let fileContent = this.getSongAttributes(song.title, song.info);
    fileContent += '\n' + this.getSongLyrics(song.slides);
    return fileContent.trim();
  }

  private getSongAttributes(title: string, infoArr: Array<ISongInfo>): string {
    //SongPro has a few standard/known attributes that should be
    //listed first and marked differently than any custom attributes
    const standardAttributeNames = ['artist', 'capo', 'key', 'tempo', 'year', 'album', 'tuning'];
    const standardAttributes: Array<string> = [];
    const customAttributes: Array<string> = [];
    for (const info of infoArr) {
      if (standardAttributeNames.includes(info.name.toLowerCase())) {
        standardAttributes.push(`@${info.name.toLowerCase()}=${info.value}\n`);
      } else {
        customAttributes.push(`!${info.name}=${info.value}\n`);
      }
    }

    //Title is always first
    let attributesStr = `@title=${title}\n`;
    attributesStr += standardAttributes.join('');
    attributesStr += customAttributes.join('');

    return attributesStr;
  }

  private getSongLyrics(slidesArr: Array<ISongSlide>): string {
    let lyricsStr = '';

    for (const slide of slidesArr) {
      //Don't add blank slides!
      if(slide.lyrics !== ''){
        lyricsStr += `# ${slide.title}\n\n${slide.lyrics}\n\n`;
      }
    }

    return lyricsStr;
  }
}
