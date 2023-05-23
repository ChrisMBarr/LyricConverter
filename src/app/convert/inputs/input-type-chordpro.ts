import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

interface IChordProDirectives {
  keyValuePairs: ISongInfo[];
  singles: IChordProSingleDirective[];
}

interface IChordProSingleDirective {
  name: string;
  position: number;
  sectionLabel?: string;
}

interface IChordProMatchingDirectivePairs {
  begin: IChordProSingleDirective;
  end: IChordProSingleDirective;
  type: string;
}

/**
 * @description ChordPro File Official Docs: https://chordpro.org/chordpro/
 */
export class InputTypeChordPro implements IInputConverter {
  readonly name = 'ChordPro';
  readonly fileExt = 'cho';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    //Possible file extensions for ChordPro described on this page: https://www.chordpro.org/chordpro/chordpro-introduction/
    //Possibles: .cho, .crd, .chopro, .chord, .pro
    return /^cho|crd|chopro|chord|pro$/i.test(rawFile.ext);
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    //For the purposes of LyricConverter, we do not need any comments or chord markers
    //We can just strip those out and focus on getting the song info and lyrics extracted
    const simplifiedContent = this.stripCommentsAndChords(rawFile.data);
    const directives = this.gatherDirectives(simplifiedContent);
    const songTitle = this.getSongTitle(directives, rawFile.name);
    const songInfo = this.getSongInfo(directives.keyValuePairs);
    const lyricContent = this.getLyricContentWithoutDirectives(
      directives.singles,
      simplifiedContent
    );
    const songLyrics = this.getLyrics(lyricContent);

    return {
      fileName: rawFile.name,
      title: songTitle,
      info: songInfo,
      slides: songLyrics,
    };
  }

  //Comment lines being with a #, so we just match that entire line including the line break at the end
  private readonly patternComments = /^#.*([\r\n])*/gm;

  //Chord markers like [E] or [Bm7] or [G/B] can appear anywhere. This matches anything between square brackets
  private readonly patternChords = /\[.+?\]/gm;

  //Directives appear between curly brackets. Some have a name:value pair, others just mark something
  private readonly patternDirectives = /{(.+?)}/gm;

  private readonly patternDirectiveStartMarkers = /^((?:so)|(?:start_of_))([a-z]+)/;

  private stripCommentsAndChords(content: string): string {
    //Replaces all comment lines and chord markers with nothing
    return content.replace(this.patternComments, '').replace(this.patternChords, '');
  }

  private gatherDirectives(content: string): IChordProDirectives {
    //In ChordPro the Directives are anything that appear between curly braces.
    //We just want to find all of those here to parse separately
    //We are NOT modifying the file content here because we might need some directives to tell us information about the lyrics

    const directiveMatches = content.matchAll(this.patternDirectives);

    const foundDirectives: IChordProDirectives = {
      keyValuePairs: [],
      singles: [],
    };

    for (const match of directiveMatches) {
      const directiveContent = match[1];
      if (directiveContent != null) {
        const pos = match.index ?? /* istanbul ignore next */ 0;

        //Anything with a colon we treat as info, EXCEPT FOR labeled directive start markers
        if (directiveContent.includes(':')) {
          //Split anything with a colon into an array, then remove any empty string from the array
          const pair = directiveContent.split(':').filter((s) => s.trim() !== '');
          if ((pair[0] != null) && (pair[1] != null)) {
            if (this.patternDirectiveStartMarkers.test(directiveContent)) {
              foundDirectives.singles.push({
                name: pair[0].trim(),
                position: pos,
                sectionLabel: pair[1].trim(),
              });
            } else {
              foundDirectives.keyValuePairs.push({
                name: pair[0].trim(),
                value: pair[1].trim(),
              });
            }
          }
        } else {
          foundDirectives.singles.push({
            name: directiveContent.trim(),
            position: pos,
          });
        }
      }
    }
    return foundDirectives;
  }

  private getSongTitle(directives: IChordProDirectives, fileNameFallback: string): string {
    const realTitle = directives.keyValuePairs.find((d) => d.name.toLowerCase() === 'title');

    if (realTitle) {
      return realTitle.value.toString();
    }

    return fileNameFallback;
  }

  private getSongInfo(keyValuePairs: ISongInfo[]): ISongInfo[] {
    //List of item names to not include in the song info
    //These are ChordPro specific things that we don't care about saving
    //The title has already been extracted, so we skip that too
    const skipNames = ['gc', 'title', 'chorus'];
    //Values to not include in the song info
    //These might be markers to tel CHordPro where to display different parts of a song
    const skipValues = ['chorus'];
    return keyValuePairs.filter((kvp) => {
      return (
        !skipNames.includes(kvp.name.toLowerCase()) &&
        !skipValues.includes(kvp.value.toString().toLowerCase())
      );
    });
  }

  private getMatchedDirectivePairs(
    singleDirectives: IChordProSingleDirective[]
  ): IChordProMatchingDirectivePairs[] {
    const pairs: IChordProMatchingDirectivePairs[] = [];
    for (const dir of singleDirectives) {
      const foundStart = this.patternDirectiveStartMarkers.exec(dir.name);
      if (foundStart) {
        let matchingEnd;
        if (foundStart[1] === 'so') {
          matchingEnd = singleDirectives.find((d) => d.name === 'eo' + foundStart[2]);
        } else if (foundStart[1] === 'start_of_') {
          matchingEnd = singleDirectives.find((d) => d.name === 'end_of_' + foundStart[2]);
        }

        if ((foundStart[2] != null) && matchingEnd) {
          pairs.push({
            begin: dir,
            end: matchingEnd,
            type: foundStart[2],
          });
        }
      }
    }

    return pairs;
  }

  private getLyricContentWithoutDirectives(
    singleDirectives: IChordProSingleDirective[],
    content: string
  ): string {
    //ChordPro Environment directives should always have a beginning and an ending tag
    //https://www.chordpro.org/chordpro/chordpro-directives/
    //Here we want to extract the content between them for the types we care about
    //and then remove ALL paired directives and the content between them

    interface ISavedContent { full: string; content: string; type: string; sectionLabel?: string }

    //The ones we want to find and keep:
    //  Chorus: {soc} and {eoc} OR {start_of_chorus} and {end_of_chorus}
    //  Verse:  {sov} and {eov} OR {start_of_verse}  and {end_of_verse}
    //  Bridge: {sob} and {eob} OR {start_of_bridge} and {end_of_bridge}
    //All of the start tags from the above example can possibly contain section labels
    //  {soc: Chorus 2} OR {start_of_chorus: Chorus 3}
    const pairs = this.getMatchedDirectivePairs(singleDirectives);
    const contentToRemove = [];
    const contentToSaveAndReformat: ISavedContent[] = [];
    const typesToSave = ['c', 'v', 'b', 'chorus', 'verse', 'bridge'];
    for (const p of pairs) {
      //we have the positions for the begin/end tags.
      //we can slice up the content string between these values
      //We modify the positions to account for the }, {, and newline characters

      const contentAndTags = content.substring(
        p.begin.position,
        p.end.position + p.end.name.length + 2
      );

      if (typesToSave.includes(p.type)) {
        let beginPos = p.begin.position + p.begin.name.length + 3;
        if (p.begin.sectionLabel != null) {
          beginPos += p.begin.sectionLabel.length + 1;
        }
        const pairContent = content.substring(beginPos, p.end.position);

        contentToSaveAndReformat.push({
          full: contentAndTags,
          content: pairContent,
          type: p.type,
          sectionLabel: p.begin.sectionLabel,
        });
      } else {
        //Strings of the tag pairs and content we want to remove
        contentToRemove.push(contentAndTags);
      }
    }

    //At this point we can just delete the sections we don't care about to make finding things easier
    const contentWithRemovedSections = contentToRemove.reduce(
      (accumulator: string, toRemove: string) => {
        return accumulator.replace(toRemove, '');
      },
      content
    );

    //Here we want to replace the tags and the content with just the content
    //If a title needs to be added, we will add it
    const contentWithNormalizedLyricPairs = contentToSaveAndReformat.reduce(
      (accumulator: string, toReplace: ISavedContent) => {
        let title = '';
        if (toReplace.sectionLabel != null) {
          title = toReplace.sectionLabel;
        } else {
          if (/^c(horus)?$/.test(toReplace.type) && !/^chorus/i.test(toReplace.content)) {
            title = 'Chorus:\n';
          } else if (/^v(erse)?$/.test(toReplace.type) && !/^verse/i.test(toReplace.content)) {
            title = 'Verse:\n';
          } else if (/^b(ridge)?$/.test(toReplace.type) && !/^bridge/i.test(toReplace.content)) {
            title = 'Bridge:\n';
          }
        }

        return accumulator.replace(toReplace.full, title + toReplace.content);
      },
      contentWithRemovedSections
    );

    //Now remove all directives because we have extracted all needed information from them at this point
    const contentWithoutDirectives = contentWithNormalizedLyricPairs
      .replace(this.patternDirectives, '')
      .trim();

    return contentWithoutDirectives;
  }

  private getLyrics(content: string): ISongSlide[] {
    const slides: ISongSlide[] = [];
    const sections = content.split('\n\n');

    for (const s of sections) {
      //Each section should begin with the name of the section
      //If so we will use that as a title with the colon removed
      //If not we will just use "Verse"
      const lines = s.trim().split('\n');
      if (lines[0] != null) {
        let title = lines[0].trim();
        let lyrics = s.trim();

        if (/^(chorus|verse|bridge)/i.test(title)) {
          title = title.replace(':', '');
          lyrics = lyrics.replace(lines[0] + '\n', '');
        } else {
          title = 'Verse';
        }

        slides.push({ title, lyrics });
      }
    }

    return slides;
  }
}
