import { IPro4Properties, IPro4Slide, IPro4Song, ProPresenter4Parser } from 'propresenter-parser';

import { version } from '../../version';
import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { IInputConverter } from './input-converter.model';

export class InputTypeProPresenter4 implements IInputConverter {
  readonly name = 'ProPresenter 4';
  readonly fileExt = 'pro4';
  readonly url = 'https://renewedvision.com/propresenter/';

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    return rawFile.ext.toLowerCase() === this.fileExt;
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    const parsedDoc: IPro4Song = ProPresenter4Parser(rawFile.dataAsString);

    let title = parsedDoc.properties.CCLISongTitle;
    if (title === '') title = rawFile.name;

    return {
      originalFile: {
        extension: this.fileExt,
        format: this.name,
        name: rawFile.name,
      },
      lyricConverterVersion: version,
      timestamp: new Date().toISOString(),
      title,
      info: this.getInfo(parsedDoc.properties),
      slides: this.getSlides(parsedDoc.slides),
    };
  }

  private getInfo(props: IPro4Properties): Array<ISongInfo> {
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
    props: IPro4Properties,
    infoName: string,
    propKey: keyof IPro4Properties,
  ): void {
    const val = props[propKey];
    if ((typeof val === 'string' || typeof val === 'number') && val !== '') {
      arr.push({ name: infoName, value: val });
    }
  }

  private getSlides(slidesArr: Array<IPro4Slide>): Array<ISongSlide> {
    const slidesList: Array<ISongSlide> = [];

    for (const slide of slidesArr) {
      const title = slide.label;
      //combine text of multiple text elements on a single slide
      const lyrics = slide.textElements.map((txt) => txt.textContent).join('\n');
      if (title !== '' || lyrics !== '') {
        slidesList.push({ title, lyrics });
      }
    }

    return slidesList;
  }
}
