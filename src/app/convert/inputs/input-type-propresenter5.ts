import {
  IPro5Properties,
  IPro5SlideGroup,
  IPro5Song,
  ProPresenter5Parser,
} from 'propresenter-parser';

import { version } from '../../version';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

export class InputTypeProPresenter5 implements IInputConverter {
  readonly name = 'ProPresenter 5';
  readonly fileExt = 'pro5';
  readonly url = 'https://renewedvision.com/propresenter/';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    return rawFile.ext.toLowerCase() === this.fileExt;
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const parsedDoc: IPro5Song = ProPresenter5Parser(rawFile.dataAsString);

    let title = parsedDoc.properties.CCLISongTitle;
    if (title === '') title = rawFile.name;

    return {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      outputFileName: rawFile.name, //song inputs are a one-to-one relationship for PP5, so the file name does not change when converting
      lyricConverterVersion: version,
      timestamp: new Date().toISOString(),
      title,
      info: this.getInfo(parsedDoc.properties),
      slides: this.getSlides(parsedDoc.slideGroups),
    };
  }

  private getInfo(props: IPro5Properties): Array<ISongInfo> {
    const info: Array<ISongInfo> = [];

    this.addStringPropValue(info, props, 'Album', 'album');
    this.addStringPropValue(info, props, 'Artist Credits', 'CCLIArtistCredits');
    this.addStringPropValue(info, props, 'Artist', 'artist');
    this.addStringPropValue(info, props, 'Author', 'author');
    this.addStringPropValue(info, props, 'CCLI Number', 'CCLILicenseNumber');
    this.addStringPropValue(info, props, 'Category', 'category');
    this.addStringPropValue(info, props, 'Copyright', 'CCLICopyrightInfo');
    this.addStringPropValue(info, props, 'Creator Code', 'creatorCode');
    this.addStringPropValue(info, props, 'Notes', 'notes');
    this.addStringPropValue(info, props, 'Publisher', 'CCLIPublisher');
    this.addStringPropValue(info, props, 'Resources Directory', 'resourcesDirectory');

    return info;
  }

  private addStringPropValue(
    arr: Array<ISongInfo>,
    props: IPro5Properties,
    infoName: string,
    propKey: keyof IPro5Properties,
  ): void {
    const val = props[propKey];
    if ((typeof val === 'string' || typeof val === 'number') && val !== '') {
      arr.push({ name: infoName, value: val });
    }
  }

  private getSlides(slideGroups: Array<IPro5SlideGroup>): Array<ISongSlide> {
    const slidesList: Array<ISongSlide> = [];

    for (const group of slideGroups) {
      group.slides.forEach((slide, i) => {
        let title = group.groupLabel;
        if (group.slides.length > 1) {
          //Add number suffix to every slide in the group if that group has more than one slide
          title += ` (${(i + 1).toString()})`;
        }

        //combine text of multiple text elements on a single slide
        const lyrics = slide.textElements.map((txt) => txt.textContent).join('\n');

        if (title || lyrics) {
          slidesList.push({ title, lyrics });
        }
      });
    }

    return slidesList;
  }
}
