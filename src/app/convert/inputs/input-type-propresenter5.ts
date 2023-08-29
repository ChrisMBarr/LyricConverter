import { IRawDataFile } from 'src/app/convert/models/file.model';
import { ISong, ISongInfo, ISongSlide } from 'src/app/convert/models/song.model';
import { IInputConverter } from './input-converter.model';
import {
  IPro5Properties,
  IPro5SlideGroup,
  IPro5Song,
  ProPresenter5Parser,
} from 'propresenter-parser';

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
      fileName: rawFile.name,
      title,
      info: this.getInfo(parsedDoc.properties),
      slides: this.getSlides(parsedDoc.slideGroups),
    };
  }

  private getInfo(props: IPro5Properties): ISongInfo[] {
    const info: ISongInfo[] = [];

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
    arr: ISongInfo[],
    props: IPro5Properties,
    infoName: string,
    propKey: keyof IPro5Properties
  ): void {
    const val = props[propKey];
    if ((typeof val === 'string' || typeof val === 'number') && val !== '') {
      arr.push({ name: infoName, value: val });
    }
  }

  private getSlides(slideGroups: IPro5SlideGroup[]): ISongSlide[] {
    const slidesList: ISongSlide[] = [];

    for (const group of slideGroups) {
      group.slides.forEach((slide, i) => {
        let title = group.groupLabel;
        if (group.slides.length > 1) {
          //Add number suffix to every slide in the group if that group has more than one slide
          title += ` (${i + 1})`;
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
