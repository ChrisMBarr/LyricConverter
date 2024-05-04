import {
  IPro5BuilderOptions,
  IPro5BuilderOptionsProperties,
  IPro5BuilderOptionsSlide,
  ProPresenter5Builder,
} from 'propresenter-parser';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';
import { IOutputFile } from '../models/file.model';

export class OutputTypeProPresenter5 implements IOutputConverter {
  readonly name = 'ProPresenter 5';
  readonly fileExt = 'pro5';
  readonly url = 'https://renewedvision.com/propresenter/';

  convertToType(song: ISong): IOutputFile {
    const builderOpts: IPro5BuilderOptions = {
      properties: {
        title: song.title,
        width: 1920,
        height: 1080,
      },
      slideTextFormatting: {
        textPadding: 20,
      },
      slideGroups: [
        //Currently group info is not gathered by LyricConverter, so just put all found slides into a single group after a blank slide
        { label: 'Blank', groupColor: '#FF0000', slides: [''] },
        { label: 'Song', groupColor: '#0000FF', slides: this.getSlides(song.slides) },
      ],
    };

    this.setProperties(song.info, builderOpts.properties);
    const fileContent = ProPresenter5Builder(builderOpts);

    return {
      songData: song,
      fileName: `${song.originalFile.name}.${this.fileExt}`,
      outputContent: fileContent,
    };
  }

  private setProperties(songInfo: Array<ISongInfo>, props: IPro5BuilderOptionsProperties): void {
    this.setPropertyValueByNamePattern(songInfo, /album/i, props, 'album');
    this.setPropertyValueByNamePattern(songInfo, /artist/i, props, 'artist');
    this.setPropertyValueByNamePattern(songInfo, /author/i, props, 'author');
    this.setPropertyValueByNamePattern(songInfo, /category/i, props, 'category');
    this.setPropertyValueByNamePattern(songInfo, /(ccliNo)|(CCLI ?Number)/i, props, 'ccliNumber');
    this.setPropertyValueByNamePattern(songInfo, /(year)|(copyright)/i, props, 'copyrightYear');
    this.setPropertyValueByNamePattern(songInfo, /notes/i, props, 'notes');
    this.setPropertyValueByNamePattern(songInfo, /publisher/i, props, 'publisher');
  }

  private setPropertyValueByNamePattern(
    info: Array<ISongInfo>,
    namePattern: RegExp,
    props: IPro5BuilderOptionsProperties,
    propertyKey: keyof IPro5BuilderOptionsProperties,
  ): void {
    const infoMatch = info.find((i) => namePattern.test(i.name));
    if (infoMatch !== undefined) {
      //force the type here since we will only be setting properties with string values
      (props[propertyKey] as string | number) = infoMatch.value.toString();
    }
  }

  private getSlides(slides: Array<ISongSlide>): Array<IPro5BuilderOptionsSlide> {
    const slidesArr: Array<IPro5BuilderOptionsSlide> = [];

    for (const s of slides) {
      slidesArr.push({ label: s.title, text: s.lyrics });
    }

    return slidesArr;
  }
}
