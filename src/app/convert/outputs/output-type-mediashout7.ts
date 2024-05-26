import { IOutputFile } from '../models/file.model';
import { IMediaShoutLyricPart, IMediaShoutRootDoc } from '../models/mediashout.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeMediaShout7 implements IOutputConverter {
  readonly name = 'MediaShout 7';
  readonly fileExt = 'json';
  readonly url = 'https://mediashout.com';

  convertToType(song: ISong): IOutputFile {
    const fileContent: IMediaShoutRootDoc = {
      Folders: [
        {
          Name: 'All',
          Lyrics: [
            {
              cclid: this.getStringProp(song.info, 'ccli'),
              copyrights: this.getArrayProp(song.info, 'copyright'),
              Disclaimer: this.getStringProp(song.info, 'disclaimer'),
              songId: this.getStringProp(song.info, 'song id') ?? this.makeGuid(),
              Title: song.title,
              SongNumber: this.getStringProp(song.info, 'song num'),
              Authors: this.getArrayProp(song.info, 'author'),
              LyricParts: this.getLyricParts(song.slides),
            },
          ],
        },
      ],
    };

    return {
      songData: song,
      fileName: `${song.outputFileName}.${this.fileExt}`,
      outputContent: JSON.stringify(fileContent, null, 2),
    };
  }

  private getStringProp(songInfo: Array<ISongInfo>, key: string): string | null {
    const found = songInfo.find((x) => x.name.toLowerCase().includes(key));
    return found ? found.value.toString() : null;
  }

  private getArrayProp(songInfo: Array<ISongInfo>, key: string): Array<string> {
    //Find any piece of info with "author" in the name and got those values. If any are comma separated, extract those values
    return songInfo
      .filter((x) => x.name.toLowerCase().includes(key))
      .flatMap((x) => x.value.toString().split(','));
  }

  private getLyricParts(slidesArray: Array<ISongSlide>): Array<IMediaShoutLyricPart> {
    return slidesArray.map((slide) => {
      return {
        Lyrics: slide.lyrics,
        PartType: 0,
        PartTypeNumber: 1,
        PartLabel: slide.title,
        Guid: this.makeGuid(),
      };
    });
  }

  private makeGuid(): string {
    //Makes a randomly generated GUID like "6f81de47-9461-4207-9717-d446516f5733"
    function s4(): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
        .toUpperCase();
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
  }
}
