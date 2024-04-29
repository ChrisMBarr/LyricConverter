import ChordSheetJS, { Paragraph, Tag } from 'chordsheetjs';

import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';
import { IRawDataFile } from '../models/file.model';

/**
 * @description ChordPro File Official Docs: https://chordpro.org/chordpro/
 */
export class InputTypeChordPro implements IInputConverter {
  readonly name = 'ChordPro';
  readonly fileExt = 'cho';
  readonly url = 'https://chordpro.org/';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    //Possible file extensions for ChordPro described on this page: https://www.chordpro.org/chordpro/chordpro-introduction/
    //Possibles: .cho, .crd, .chopro, .chord, .pro
    return /^cho|crd|chopro|chord|pro$/i.test(rawFile.ext);
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const parser = new ChordSheetJS.ChordProParser();
    const parsedSong = parser.parse(rawFile.dataAsString);
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition  --  typedefs are wrong
    const title = parsedSong.title ?? rawFile.name;
    const info = this.getSongInfo(parsedSong.metadata.metadata, parsedSong.bodyParagraphs);

    return {
      fileName: rawFile.name,
      title,
      info,
      slides: [],
    };
  }

  private getSongInfo(
    meta: Record<string, string | Array<string>>,
    bodyParagraphs: Array<Paragraph>,
  ): Array<ISongInfo> {
    const songInfo: Array<ISongInfo> = Object.entries(meta)
      .filter((kvp) => kvp[0] !== 'title') //we already have the title, we don't need it here
      .map((kvp) => {
        //TODO: Deal with array values
        return { name: kvp[0], value: kvp[1].toString() };
      });

    const items = bodyParagraphs.flatMap((p) => p.lines.flatMap((l) => l.items));
    const skipValues = ['chorus'];
    const tags = items.filter(
      (x): x is Tag =>
        x instanceof Tag && x.name === 'comment' && !skipValues.includes(x.value.toLowerCase()),
    );

    const tagsAsInfo: Array<ISongInfo> = tags.map((c) => ({
      name: c.name,
      value: c.value,
    }));

    return songInfo.concat(tagsAsInfo);
  }

  // private getLyrics(content: string): Array<ISongSlide> {
  //   const slides: Array<ISongSlide> = [];
  //   const sections = content.split('\n\n');

  //   for (const s of sections) {
  //     //Each section should begin with the name of the section
  //     //If so we will use that as a title with the colon removed
  //     //If not we will just use "Verse"
  //     const lines = s.trim().split('\n');
  //     if (lines[0] != null) {
  //       let title = lines[0].trim();
  //       let lyrics = s.trim();

  //       if (/^(chorus|verse|bridge)/i.test(title)) {
  //         title = title.replace(':', '');
  //         lyrics = lyrics.replace(lines[0] + '\n', '');
  //       } else {
  //         title = 'Verse';
  //       }

  //       slides.push({ title, lyrics });
  //     }
  //   }

  //   return slides;
  // }
}
