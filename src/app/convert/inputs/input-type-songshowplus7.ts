import { SongShowPlus } from 'songshowplus-parser';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { STRING_LIST_SEPARATOR_JOIN } from '../shared/constants';
import { IInputConverter } from './input-converter.model';

export class InputTypeSongShowPlus7 implements IInputConverter {
  readonly name = 'SongShow Plus 7';
  readonly fileExt = 'sbsong';
  readonly url = 'https://songshowplus.com/';

  doesInputFileMatchThisType(file: IRawDataFile): boolean {
    //TODO: Determine a way to check the version or if that's even important!
    return file.ext.toLowerCase() === this.fileExt;
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const sspParser = new SongShowPlus();
    const parsedSong = sspParser.parse(rawFile.data);

    const title = parsedSong.title === '' ? rawFile.name : parsedSong.title;

    const info: ISongInfo[] = [];
    if (parsedSong.artist !== '') info.push({ name: 'Artist', value: parsedSong.artist });
    if (parsedSong.copyright !== '') info.push({ name: 'Copyright', value: parsedSong.copyright });
    if (parsedSong.ccli !== '') info.push({ name: 'CCLI', value: parsedSong.ccli });
    if (parsedSong.keywords.length > 0) {
      info.push({
        name: 'Keywords',
        value: parsedSong.keywords.join(STRING_LIST_SEPARATOR_JOIN) });
    }

    //These object use the same property keys, so we can just copy it over
    const slides: ISongSlide[] = parsedSong.sections;

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }
}
