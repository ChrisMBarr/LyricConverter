import { Injectable } from '@angular/core';
import { FormatProPresenter } from './format-propresenter';
import { FormatJson } from './format-json';
import { IRawDataFile } from 'src/app/shared/file.model';
import { IFormat } from './format.model';
import { FormatText } from './format-text';

@Injectable({
  providedIn: 'root',
})
export class FormatterService {
  constructor(
    private fmtProPresenter: FormatProPresenter,
    private fmtJson: FormatJson,
    private fmtText: FormatText,
  ) {}

  //List of all available formatters
  private formatters: IFormat[] = [
    this.fmtProPresenter,
    this.fmtJson,
    this.fmtText,
  ];

  detectFormat(f: IRawDataFile): IFormat | undefined {
    return this.formatters.find((formatter: IFormat )=>{
      return formatter.testFormat(f);
    });
  }
}
