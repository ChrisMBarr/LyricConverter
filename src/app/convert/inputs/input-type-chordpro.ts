import { ChordLyricsPair, ChordProParser, Paragraph, Tag } from 'chordsheetjs';

import { version } from '../../version';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

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

    if (rawFile.ext === 'pro') {
      //Accept a ChordPro file and reject a ProPresenter file
      //Look for something basic like a ChordPro directive of any kind
      return /{\w+:[\s\w]+}/i.test(rawFile.dataAsString);
    } else {
      return /^cho|crd|chopro|chord$/i.test(rawFile.ext);
    }
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const parser = new ChordProParser();

    //Needed until this is fixed: https://github.com/martijnversluis/ChordSheetJS/issues/1178
    const preProcessedData = rawFile.dataAsString
      .replace(/{start_of_svg}[\s\S]+?{end_of_svg}/, '')
      .replace(/{start_of_textblock.+?}[\s\S]+?{end_of_textblock}/, '');

    const parsedSong = parser.parse(preProcessedData);

    const title = parsedSong.title ?? rawFile.name;
    const info = this.getSongInfo(parsedSong.metadata.metadata, parsedSong.bodyParagraphs);
    const slides = this.getLyrics(parsedSong.bodyParagraphs);

    return {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      outputFileName: rawFile.name, //song inputs are a one-to-one relationship for ChordPro, so the file name does not change when converting
      lyricConverterVersion: version,
      timestamp: new Date().toISOString(),
      title,
      info,
      slides,
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

  private getLyrics(bodyParagraphs: Array<Paragraph>): Array<ISongSlide> {
    const slides: Array<ISongSlide> = [];

    for (const paragraph of bodyParagraphs) {
      //join all lyrics together, ignoring the chords
      const lyricLines = paragraph.lines.map((line) =>
        line.items
          .filter((item): item is ChordLyricsPair => item instanceof ChordLyricsPair)
          .map((item) => item.lyrics)
          .join(''),
      );

      //Sometimes we might have a paragraph title/label that is not inside a curly brace tag/directive. We will want to grab
      const foundTitleIdx = lyricLines.findIndex((l) => /^(chorus|verse|bridge)/i.test(l));
      let title = paragraph.label ?? paragraph.type;

      //If we found a title from above...
      if (foundTitleIdx > -1) {
        //Use it as the title, but remove the colon if it exists
        title = lyricLines[foundTitleIdx]?.replace(':', '') ?? title;
        //discard that line from the lyrics
        lyricLines.splice(foundTitleIdx, 1);
      }

      //"none" sucks as a label, use something better
      if (title === 'none') title = 'verse';

      //Capitalize the first letter of the title
      title = title.charAt(0).toUpperCase() + title.slice(1);

      //Join all lines together with line breaks
      const lyrics = lyricLines.join('\n').trim();

      //Don't add slides with empty lyrics
      if (lyrics !== '') {
        slides.push({ title, lyrics });
      }
    }

    return slides;
  }
}
