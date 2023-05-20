import { IRawDataFile } from 'src/app/convert/models/file.model';
import { IInputConverter } from './input-converter.model';
import { ISong, ISongInfo, ISongSlide } from 'src/app/convert/models/song.model';

export class InputTypePlainText implements IInputConverter {
  readonly name = 'Plain Text';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    //TODO: Test to make sure this is NOT SongPro!
    return rawFile.ext.toLowerCase() === 'txt';
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    let title = rawFile.name; //default/fallback name
    let info: ISongInfo[] = [];
    let slides: ISongSlide[] = [];
    //The info and the lyrics are separated by 3 newline characters
    const parts = rawFile.data.split('\n\n\n');
    if (parts.length === 2 && (parts[0] != null) && (parts[1] != null)) {
      info = this.getSongInfo(parts[0]);
      if (info[0]?.name.toLowerCase() === 'title') {
        title = info[0].value.toString();
        info = info.slice(1);
      }
      slides = this.getSongLyrics(parts[1]);
    }

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }

  private getSongInfo(infoContent: string): ISongInfo[] {
    const info: ISongInfo[] = [];

    for (const line of infoContent.split('\n')) {
      const lineParts = line.split(':');
      if ((lineParts[0] != null) && (lineParts[1] != null)) {
        info.push({ name: lineParts[0].trim(), value: lineParts[1].trim() });
      }
    }

    return info;
  }

  private getSongLyrics(lyricsContent: string): ISongSlide[] {
    const slides: ISongSlide[] = [];

    for (const section of lyricsContent.split('\n\n')) {
      const lines = section.split('\n');
      let title = '';
      let lyrics = section;
      if ((lines[0] != null) && (lines[0]?.endsWith(':') ?? false)) {
        title = lines[0].replace(':', '').trim();
        lyrics = lyrics.replace(lines[0] + '\n', '').trim();
      }

      slides.push({
        title,
        lyrics,
      });
    }

    return slides;
  }
}
