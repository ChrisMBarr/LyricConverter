import { Injectable } from '@angular/core';
import { FormatProPresenter } from './format-propresenter';
import { FormatLyricConverter } from './format-lyric-converter';
import { IRawDataFile } from 'src/app/shared/file.model';
import { IFormat } from './format.model';
import { FormatText } from './format-text';

@Injectable({
  providedIn: 'root',
})
export class FormatterService {
  //List of all available formatters
  formatters: IFormat[] = [
    new FormatProPresenter(),
    new FormatLyricConverter(),
    new FormatText(),
  ];

  constructor() {}

  detectFormat(f: IRawDataFile): IFormat | undefined {
    return this.formatters.find((formatter: IFormat) => {
      return formatter.testFormat(f);
    });
  }
}
