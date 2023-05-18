import { Injectable } from '@angular/core';
import { IFileWithData, IRawDataFile } from '../models/file.model';
import { Utils } from '../utils/utils';
import { IInputConverter } from '../inputs/input-converter.model';
import { InputTypeJSON } from '../inputs/input-type-json';
import { InputTypeProPresenter } from '../inputs/input-type-propresenter';
import { InputTypeText } from '../inputs/input-type-text';
import { IOutputConverter } from '../outputs/output-converter.model';
import { OutputTypeDisplaySlides } from '../outputs/output-type-display-slides';
import { OutputTypeText } from '../outputs/output-type-text';
import { OutputTypeJSON } from '../outputs/output-type-json';
import { OutputTypeProPresenter } from '../outputs/output-type-propresenter';
import { InputTypeChordPro } from '../inputs/input-type-chordpro';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  //List of all available Input Converters
  readonly inputConverters: IInputConverter[] = [
    new InputTypeProPresenter(),
    new InputTypeChordPro(),
    new InputTypeText(),
    new InputTypeJSON()
  ];

  readonly outputConverters: IOutputConverter[] = [
    new OutputTypeProPresenter(),
    new OutputTypeText(),
    new OutputTypeDisplaySlides(),
    new OutputTypeJSON()
  ];

  parseFiles(files: IFileWithData[]): IRawDataFile[] {
    const rawDataFiles: IRawDataFile[] = [];
    for (const f of files) {
      let data = '';

      if (typeof f.data === 'string') {
        data = Utils.decodeBase64(f.data.replace(/^data:.*;base64,/, ''));
      }

      rawDataFiles.push({
        name: f.nameWithoutExt,
        ext: f.ext,
        type: f.type,
        data,
      });
    }

    return rawDataFiles;
  }

  detectInputTypeAndGetConverter(f: IRawDataFile): IInputConverter | undefined {
    return this.inputConverters.find((c: IInputConverter) => {
      return c.doesInputFileMatchThisType(f);
    });
  }
}
