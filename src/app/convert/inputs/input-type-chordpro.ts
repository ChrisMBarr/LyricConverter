import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

/**
 * @description Official docs: https://www.chordpro.org/chordpro/chordpro-introduction/
 */
export class InputTypeChordPro implements IInputConverter {
  readonly name = 'ChordPro';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    //Possible file extensions for ChordPro described on this page: https://www.chordpro.org/chordpro/chordpro-introduction/
    //Possibles: .cho, .crd, .chopro, .chord, .pro
    return /^cho|crd|chopro|chord|pro$/i.test(rawFile.ext);
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const allSongInfo = this.getSongInfo(rawFile);

    return {
      fileName: rawFile.name,
      title: allSongInfo.title,
      info: allSongInfo.info,
      slides: this.getLyrics(rawFile),
    };
  }

  private readonly infoRegex = /{.+?:.+?}/gim;

  private getSongInfo(rawFile: IRawDataFile): { title: string; info: ISongInfo[] } {
    const infoArr: ISongInfo[] = [];
    const infoSections = rawFile.data.match(this.infoRegex);

    //Get the title filename, but we will replace this later if we find a better source
    let songTitle = rawFile.name;

    if (infoSections) {
      for (const info of infoSections) {
        const sectionParts = info.replace(/^{(.*)}/, '$1').split(':');
        const name = (sectionParts[0] || '').trim();
        const val = (sectionParts[1] || '').trim();

        if (/title/i.test(name)) {
          //If we find the title in the info, use that instead of the filename
          songTitle = val;
        } else {
          infoArr.push({
            name: name,
            value: val,
          });
        }
      }
    }

    return {
      title: songTitle,
      info: infoArr,
    };
  }

  private getLyrics(rawFile: IRawDataFile): ISongSlide[] {
    const slides: ISongSlide[] = [];

    const songMinusInfo = rawFile.data.replace(this.infoRegex, '');

    //Find the parts that being with the title, a colon, and then a block of single-spaced characters
    const songParts = songMinusInfo.match(/(\w+(\s\d)*:[\r\n]+)*(.+[\n\r])+/gim);

    //Loop over these parts
    if(songParts){
    for (const part of songParts) {
      // remove all bracket groups, then split the lines into an array
      const lines = part
        .replace(/\[.+?\]|{.+?}/g, '')
        .trim()
        .split(/[\r\n]+/g);

      //Get the first line from the array, and remove the colon. Now we have the slide title
      let title = '';
      if ((lines[0] || '').indexOf(':') > 0) {
        title = (lines.shift() || '').replace(':', '').trim();
      }

      //Join the remaining lines together
      const lyrics = lines.join('\n').trim();

      slides.push({
        title: title,
        lyrics: lyrics,
      });
    }
  }
    return slides;
  }
}
