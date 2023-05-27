import { XMLParser } from 'fast-xml-parser';
import { IRawDataFile } from 'src/app/convert/models/file.model';
import { ISong, ISongInfo, ISongSlide } from 'src/app/convert/models/song.model';
import { IInputConverter } from './input-converter.model';
import {
  IProPresenter5DisplaySlide,
  IProPresenter5Document,
} from '../models/propresenter-document.model';
import { Utils } from '../shared/utils';

export class InputTypeProPresenter5 implements IInputConverter {
  readonly name = 'Pro Presenter 5';
  readonly fileExt = 'pro5';
  readonly url = 'https://renewedvision.com/propresenter/';

  constructor(private readonly window: Window) {}

  doesInputFileMatchThisType(rawFile: IRawDataFile): boolean {
    return rawFile.ext.toLowerCase() === this.fileExt;
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    //When certain XML nodes only have one item the parser will convert them into objects
    //Here we maintain a list of node paths to always keep as arrays
    //This keeps our code structure and typedefs more sane and normalized
    const alwaysArray = [
      'RVPresentationDocument.groups.RVSlideGrouping',
      'RVPresentationDocument.slides.RVDisplaySlide',
      'RVPresentationDocument.groups.RVSlideGrouping.slides.RVDisplaySlide',
    ];

    const xmlParser = new XMLParser({
      //https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseAttributeValue: true,
      isArray: (_name, jPath: string) => alwaysArray.includes(jPath),
    });
    const parsedDoc: IProPresenter5Document = xmlParser.parse(rawFile.data);

    const title = parsedDoc.RVPresentationDocument.CCLISongTitle ?? rawFile.name;
    const info: ISongInfo[] = this.getInfo(parsedDoc);
    const slides: ISongSlide[] = this.getSlides(parsedDoc);

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }

  private getInfo(doc: IProPresenter5Document): ISongInfo[] {
    const skipKeys = [
      'CCLIDisplay',
      'backgroundColor',
      'docType',
      'drawingBackgroundColor',
      'height',
      'lastDateUsed',
      'usedCount',
      'versionNumber',
      'width',
    ];
    const info: ISongInfo[] = [];

    //Loop through all top-level object properties, skipping over a few hard-coded ones
    //If the value is a string or a number, add it to the info
    Object.keys(doc.RVPresentationDocument).forEach((k) => {
      if (!skipKeys.includes(k)) {
        const val = doc.RVPresentationDocument[k];
        if ((typeof val === 'string' && val !== '') || typeof val === 'number') {
          info.push({
            name: k,
            value: val,
          });
        }
      }
    });
    return info;
  }

  private getSlides(doc: IProPresenter5Document): ISongSlide[] {
    const slidesList: ISongSlide[] = [];

    doc.RVPresentationDocument.groups.RVSlideGrouping.forEach((group) => {
      group.slides.RVDisplaySlide.forEach((groupSlide, i) => {
        let title = group.name || '';
        if (group.slides.RVDisplaySlide.length > 1) {
          //Add number suffix to every slide in the group if that group has more than one slide
          title += ` (${i + 1})`;
        }
        const lyrics = this.getGroupSideLyrics(groupSlide);

        if (title || lyrics) {
          slidesList.push({ title, lyrics });
        }
      });
    });

    return slidesList;
  }

  private getGroupSideLyrics(slide: IProPresenter5DisplaySlide): string {
    let lyrics = '';

    if (typeof slide.displayElements.RVTextElement !== 'undefined') {
      lyrics = Utils.stripRtf(this.window.atob(slide.displayElements.RVTextElement.RTFData));
    }

    return lyrics;
  }
}
