import { XMLParser } from 'fast-xml-parser';
import { IRawDataFile } from 'src/app/convert/models/file.model';
import { ISong, ISongInfo, ISongSlide } from 'src/app/convert/models/song.model';
import { IInputConverter } from './input-converter.model';
import {
  IProPresenter4Document,
  IProPresenter5DisplaySlide,
  IProPresenter5Document,
} from '../models/propresenter-document.model';

export class InputTypeProPresenter implements IInputConverter {
  readonly name = 'ProPresenter';

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    //just test the file extension for ProPresenter 4 or 5 file names
    return /^pro[45]$/.test(rawFile.ext);
  };

  extractSongData = (rawFile: IRawDataFile): ISong => {
    //When certain XML nodes only have one item the parser will convert them into objects
    //Here we maintain a list of node paths to always keep as arrays
    //This keeps our code structure and typedefs more sane and normalized
    const alwaysArray = [
      'RVPresentationDocument.groups.RVSlideGrouping',
      'RVPresentationDocument.slides.RVDisplaySlide',
      'RVPresentationDocument.groups.RVSlideGrouping.slides.RVDisplaySlide'
    ];

    const xmlParser = new XMLParser({
      //https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseAttributeValue: true,
      isArray: (_name, jPath: string) => alwaysArray.indexOf(jPath) !== -1,
    });
    const parsedDoc: IProPresenter4Document | IProPresenter5Document = xmlParser.parse(
      rawFile.data
    );

    const title = parsedDoc.RVPresentationDocument.CCLISongTitle || rawFile.name;
    const info: ISongInfo[] = this.getInfo(parsedDoc);
    let slides: ISongSlide[] = [];

    if (rawFile.ext === 'pro4') {
      slides = this.getV4Slides(<IProPresenter4Document>parsedDoc);
    } else if (rawFile.ext === 'pro5') {
      slides = this.getV5Slides(<IProPresenter5Document>parsedDoc);
    }

    return {
      fileName: rawFile.name,
      title: title,
      info: info,
      slides: slides,
    };
  };

  stripRtf(str: string): string {
    const basicRtfPattern = /\{\*?\\[^{}]+;}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
    const newLineSlashesPattern = /\\\n/g;
    const ctrlCharPattern = /\n\\f[0-9]\s/g;

    //Remove RTF Formatting, replace RTF new lines with real line breaks, and remove whitespace
    return str
      .replace(ctrlCharPattern, '')
      .replace(basicRtfPattern, '')
      .replace(newLineSlashesPattern, '\n')
      .trim();
  }

  private getInfo(doc: IProPresenter4Document | IProPresenter5Document): ISongInfo[] {
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

  private getV4Slides(doc: IProPresenter4Document): ISongSlide[] {
    const slidesList: ISongSlide[] = [];
    doc.RVPresentationDocument.slides.RVDisplaySlide.forEach((slide) => {
      const title = slide.label;
      const lyrics = this.stripRtf(window.atob(slide.displayElements.RVTextElement.RTFData));
      if (title || lyrics) {
        slidesList.push({ title, lyrics });
      }
    });

    return slidesList;
  }

  private getV5Slides(doc: IProPresenter5Document): ISongSlide[] {
    const slidesList: ISongSlide[] = [];

    doc.RVPresentationDocument.groups.RVSlideGrouping.forEach((group) => {
      group.slides.RVDisplaySlide.forEach((groupSlide, i) => {
        let title = group.name || '';
        if (group.slides.RVDisplaySlide.length > 1) {
          //Add number suffix to every slide in the group if that group has more than one slide
          title += ` (${i + 1})`;
        }
        const lyrics = this.getV5GroupSideLyrics(groupSlide);

        if (title || lyrics) {
          slidesList.push({ title, lyrics });
        }
      });
    });

    return slidesList;
  }

  private getV5GroupSideLyrics(slide: IProPresenter5DisplaySlide): string {
    let lyrics = '';

    if (typeof slide.displayElements.RVTextElement !== 'undefined') {
      lyrics = this.stripRtf(window.atob(slide.displayElements.RVTextElement.RTFData));
    }

    return lyrics;
  }
}
