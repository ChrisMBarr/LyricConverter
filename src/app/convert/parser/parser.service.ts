import { Injectable, isDevMode } from '@angular/core';
import { IFileWithData, IRawDataFile } from '../models/file.model';
import { Utils } from '../utils/utils';
import { IInputConverter } from '../inputs/input-converter.model';
import { InputTypeLyricConverter } from '../inputs/input-type-lyric-converter';
import { InputTypeProPresenter } from '../inputs/input-type-propresenter';
import { InputTypeText } from '../inputs/input-type-text';
import { IOutputConverter } from '../outputs/output-converter.model';
import { OutputTypeDisplaySlides } from '../outputs/output-type-display-slides';
import { OutputTypeText } from '../outputs/output-type-text';
import { OutputTypeLyricConverter } from '../outputs/output-type-lyric-converter';
import { OutputTypeProPresenter } from '../outputs/output-type-propresenter';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  //List of all available Input Converters
  readonly inputConverters: IInputConverter[] = [
    new InputTypeProPresenter(),
    new InputTypeText()
  ];

  readonly outputConverters: IOutputConverter[] = [
    new OutputTypeProPresenter(),
    new OutputTypeText(),
    new OutputTypeDisplaySlides(),
  ];

  constructor() {
    //Only allow LyricConverter JSON input/output when in development mode!
    if (isDevMode()) {
      this.inputConverters.push(new InputTypeLyricConverter());
      this.outputConverters.push(new OutputTypeLyricConverter());
    }
  }

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
