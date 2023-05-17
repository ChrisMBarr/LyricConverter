import { Injectable } from '@angular/core';
import { IFileWithData, IRawDataFile } from '../models/file.model';
import { IInputConverter } from '../inputs/input-converter.model';
import { InputTypeLyricConverter } from '../inputs/input-type-lyric-converter';
import { InputTypeProPresenter } from '../inputs/input-type-propresenter';
import { InputTypeText } from '../inputs/input-type-text';
import { IOutputConverter } from '../outputs/output-converter.model';
import { OutputTypeDisplaySlides } from '../outputs/output-type-display-slides';
import { OutputTypeText } from '../outputs/output-type-text';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  //List of all available Input Converters
  readonly inputConverters: IInputConverter[] = [
    new InputTypeProPresenter(),
    new InputTypeLyricConverter(),
    new InputTypeText(),
  ];

  readonly outputConverters: IOutputConverter[] = [
    new OutputTypeText(),
    new OutputTypeDisplaySlides(),
  ];

  parseFiles(files: IFileWithData[]): IRawDataFile[] {
    const rawDataFiles: IRawDataFile[] = [];
    for (const f of files) {
      let data = '';

      if (typeof f.data === 'string') {
        data = window.atob(f.data.replace(/^data:.*;base64,/, ''));
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
