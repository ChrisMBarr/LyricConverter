import { SongShowPlus } from 'songshowplus-parser';

import { version } from '../../version';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { STRING_LIST_SEPARATOR_JOIN } from '../shared/constants';
import { IInputConverter } from './input-converter.model';

export class InputTypeSongShowPlus7 implements IInputConverter {
  readonly name = 'SongShow Plus 7';
  readonly fileExt = 'sbsong';
  readonly url = 'https://songshowplus.com/';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    //TODO: Determine a way to check the version or if that's even important!
    return rawFile.ext.toLowerCase() === this.fileExt;
  }

  // eslint-disable-next-line complexity
  extractSongData(rawFile: IRawDataFile): ISong {
    const sspParser = new SongShowPlus();
    const parsedSong = sspParser.parse(rawFile.dataAsBuffer);

    const title = parsedSong.title === '' ? rawFile.name : parsedSong.title;

    const info: Array<ISongInfo> = [];
    if (parsedSong.author !== '') info.push({ name: 'Author', value: parsedSong.author });
    if (parsedSong.copyright !== '') info.push({ name: 'Copyright', value: parsedSong.copyright });
    if (parsedSong.ccli !== '') info.push({ name: 'CCLI', value: parsedSong.ccli });
    if (parsedSong.key !== '') info.push({ name: 'Key', value: parsedSong.key });
    if (parsedSong.comments !== '') info.push({ name: 'Comments', value: parsedSong.comments });
    if (parsedSong.verseOrder !== '')
      info.push({ name: 'Verse Order', value: parsedSong.verseOrder });
    if (parsedSong.songBook !== '') info.push({ name: 'Song Book', value: parsedSong.songBook });
    if (parsedSong.songNumber !== '')
      info.push({ name: 'Song Number', value: parsedSong.songNumber });
    if (parsedSong.topics.length > 0) {
      info.push({
        name: 'Topics',
        value: parsedSong.topics.join(STRING_LIST_SEPARATOR_JOIN),
      });
    }

    //These object use the same property keys, so we can just copy it over
    const slides: Array<ISongSlide> = parsedSong.lyricSections;

    return {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      lyricConverterVersion: version,
      timestamp: new Date().toISOString(),
      title,
      info,
      slides,
    };
  }
}
