import { IOutputFile } from '../models/file.model';
import {
  IMediaShoutLyricPart,
  IMediaShoutRootDoc,
  MediaShoutPartTypeEnum,
} from '../models/mediashout.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeMediaShout7 implements IOutputConverter {
  private readonly partTypeEnumKeys = Object.values(MediaShoutPartTypeEnum).filter(
    (value) => typeof value === 'string',
  ) as Array<string>;

  readonly name = 'MediaShout 7';
  readonly fileExt = 'json';
  readonly url = 'https://mediashout.com';

  convertToType(song: ISong): IOutputFile {
    const cclid = this.getStringProp(song.info, [
      'ccli',
      'cclid',
      'ccli number',
      'ccli #',
      'cclino',
    ]);

    const copyrights = this.getArrayProp(song.info, [
      'copyright',
      'publisher',
      'cclipublisher',
      'cclicopyrightinfo',
      'released',
    ]);

    let combinedDisclaimer: string | null = this.getArrayProp(song.info, [
      'disclaimer',
      'comment',
      'comments',
    ]).join(', ');
    if (combinedDisclaimer === '') combinedDisclaimer = null;

    const songId = this.getStringProp(song.info, ['song id', 'id']) ?? this.makeGuid();
    const songNum = this.getStringProp(song.info, ['song num', 'songnum', 'song number', 'number']);
    const authors = this.getArrayProp(song.info, [
      'author',
      'authors',
      'artist',
      'artists',
      'composer',
      'composers',
    ]);

    //For now we just export one file per song.
    //MediaShout supports multiple songs in a file, but LyricConverter would need to be reconfigured a lot to allow this for certain formats
    const fileContent: IMediaShoutRootDoc = {
      Folders: [
        {
          Name: 'All',
          Lyrics: [
            {
              cclid,
              copyrights,
              Disclaimer: combinedDisclaimer,
              songId,
              Title: song.title,
              SongNumber: songNum,
              Authors: authors,
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

  private getStringProp(
    songInfo: Array<ISongInfo>,
    possibleKeys: Array<Lowercase<string>>,
  ): string | null {
    const found = songInfo.find((x) =>
      possibleKeys.includes(x.name.toLowerCase() as Lowercase<string>),
    );
    return found ? found.value.toString() : null;
  }

  private getArrayProp(songInfo: Array<ISongInfo>, keys: Array<Lowercase<string>>): Array<string> {
    //Find any piece of info with "author" in the name and got those values. If any are comma separated, extract those values
    return songInfo
      .filter((x) => keys.includes(x.name.toLowerCase() as Lowercase<string>))
      .flatMap((x) => x.value.toString().split(/[,|]/))
      .map((s) => s.trim());
  }

  private getLyricParts(slidesArray: Array<ISongSlide>): Array<IMediaShoutLyricPart> {
    return slidesArray.map((slide) => {
      //Defaults to be the first part of a verse and the slide title is the label
      let partType: MediaShoutPartTypeEnum = MediaShoutPartTypeEnum.Verse;
      let partTypeNumber = 1;
      let partLabel: string | null = slide.title;

      //Try to extract the part type number form the title if there is one. If not just default to using 1
      //Some might end with the number between parenthesis
      const partTypeNumMatch = /\(?(\d+)\)?$/.exec(slide.title);
      const partTypeNumContainsParen = partTypeNumMatch?.[0].includes('(') ?? false;
      if (partTypeNumMatch?.[1] != null) {
        partTypeNumber = parseInt(partTypeNumMatch[1], 10);
      }

      //Exclude the number and try to parse the remainder of the label as an MediaShout part type enum, so we can use the enum number as the final value here
      //If we have a match, we use that instead of a label
      const partTypeMatch = /^\D+/.exec(slide.title);
      if (partTypeMatch?.[0] != null) {
        const partTypeToEnumName = this.tryConvertToEnum(partTypeMatch[0]).trim();
        //See if the string we have matches one on the enum. If it's greater than -1 we have a match
        const enumIndex = this.partTypeEnumKeys.indexOf(partTypeToEnumName);

        if (enumIndex > -1) {
          partType = enumIndex;

          //If the title contained a number with parentheses, we have already parsed out the "real" number, so now we can use the rest as the label
          if (partTypeNumContainsParen) {
            //example: "Verse 2 (1)" would be the first part/slide of Verse 2. So here we set the label as "Verse 2"
            partLabel = slide.title.replace(partTypeNumMatch![0], '').trim();
          } else {
            //Nothing special, the part type is set as the enum so we don't need a special label
            partLabel = null;
          }
        }
      }

      return {
        Lyrics: slide.lyrics,
        PartType: partType,
        PartTypeNumber: partTypeNumber,
        PartLabel: partLabel,
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

  private tryConvertToEnum(str: string): string {
    //via: https://stackoverflow.com/a/53952925/79677
    const pascalCased = str
      .toLowerCase()
      .replace(new RegExp(/[-_]+/, 'g'), ' ')
      .replace(new RegExp(/[^\w\s]/, 'g'), '')
      .replace(
        new RegExp(/\s+(.)(\w*)/, 'g'),
        (_$1, $2: string, $3: string) => $2.toUpperCase() + $3,
      )
      .replace(new RegExp(/\w/), (s) => s.toUpperCase());

    //Remap a few common ones to ones that appear in MediaShout
    if (pascalCased === 'PostChorus') return 'PreChorus';
    if (
      pascalCased.toLowerCase().includes('background') ||
      pascalCased.toLowerCase().includes('blank')
    ) {
      return 'Blank';
    }

    return pascalCased;
  }
}
