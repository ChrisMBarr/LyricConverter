import {
  IPro6BuilderOptions,
  IPro6BuilderOptionsProperties,
  IPro6BuilderOptionsSlide,
  ProPresenter6Builder,
} from 'propresenter-parser';

import { IOutputFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IOutputConverter } from './output-converter.model';

export class OutputTypeProPresenter6 implements IOutputConverter {
  readonly name = 'ProPresenter 6';
  readonly fileExt = 'pro6';
  readonly url = 'https://renewedvision.com/propresenter/';

  convertToType(song: ISong): IOutputFile {
    const builderOpts: IPro6BuilderOptions = {
      properties: {
        CCLISongTitle: song.title,
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
    const fileContent = ProPresenter6Builder(builderOpts);

    return {
      songData: song,
      fileName: `${song.outputFileName}.${this.fileExt}`,
      outputContent: fileContent,
    };
  }

  private setProperties(songInfo: Array<ISongInfo>, props: IPro6BuilderOptionsProperties): void {
    this.setPropertyValueByNamePattern(songInfo, /artist/i, props, 'CCLIArtistCredits');
    this.setPropertyValueByNamePattern(songInfo, /author/i, props, 'CCLIAuthor');
    this.setPropertyValueByNamePattern(songInfo, /category/i, props, 'category');
    this.setPropertyValueByNamePattern(
      songInfo,
      /(ccliNo)|(CCLI ?Number)/i,
      props,
      'CCLISongNumber',
    );
    this.setPropertyValueByNamePattern(songInfo, /(year)|(copyright)/i, props, 'CCLICopyrightYear');
    this.setPropertyValueByNamePattern(songInfo, /notes/i, props, 'notes');
    this.setPropertyValueByNamePattern(songInfo, /publisher/i, props, 'CCLIPublisher');
  }

  private setPropertyValueByNamePattern(
    info: Array<ISongInfo>,
    namePattern: RegExp,
    props: IPro6BuilderOptionsProperties,
    propertyKey: keyof IPro6BuilderOptionsProperties,
  ): void {
    const infoMatch = info.find((i) => namePattern.test(i.name));
    if (infoMatch !== undefined) {
      //force the type here since we will only be setting properties with string values
      (props[propertyKey] as string | number) = infoMatch.value.toString();
    }
  }

  private getSlides(slides: Array<ISongSlide>): Array<IPro6BuilderOptionsSlide> {
    const slidesArr: Array<IPro6BuilderOptionsSlide> = [];

    for (const s of slides) {
      slidesArr.push({ label: s.title, text: s.lyrics });
    }

    return slidesArr;
  }
}
