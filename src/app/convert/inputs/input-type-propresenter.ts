import { XMLParser } from 'fast-xml-parser';
import { IRawDataFile } from 'src/app/convert/models/file.model';
import { ISong, ISongInfo, ISongSlide } from 'src/app/convert/models/song.model';
import { IInputConverter } from './input-converter.model';
import {
  IProPresenter4Document,
  IProPresenter5Document,
} from '../models/propresenter-document.model';

export class InputTypeProPresenter implements IInputConverter {
  readonly name = 'ProPresenter';

  doesInputFileMatchThisType = (rawFile: IRawDataFile): boolean => {
    //just test the file extension for ProPresenter 4 or 5 file names
    return /^pro[45]$/.test(rawFile.ext);
  };

  extractSongData = (rawFile: IRawDataFile): ISong => {
    const xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
      parseAttributeValue: true,
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

  private getV4Slides(_doc: IProPresenter4Document): ISongSlide[] {
    return [];
  }

  private getV5Slides(_doc: IProPresenter5Document): ISongSlide[] {
    return [];
  }
}
