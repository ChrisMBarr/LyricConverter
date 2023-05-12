import { Injectable } from '@angular/core';
import { Buffer } from 'buffer';
import { IFileWithData } from '../../shared/file.model';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  constructor() {}

  parseFiles(files: IFileWithData[]) {
    console.log(files);
  }

  decode(base64Str: string): string {
    return Buffer.from(base64Str, 'base64').toString('utf8');
  }

  encode(str: string): string {
    return Buffer.from(str, 'utf8').toString('base64');
  }

  stripRtf(str: string): string {
    const basicRtfPattern =
      /\{\*?\\[^{}]+;}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
    const newLineSlashesPattern = /\\\n/g;
    const ctrlCharPattern = /\n\\f[0-9]\s/g;

    //Remove RTF Formatting, replace RTF new lines with real line breaks, and remove whitespace
    return str
      .replace(ctrlCharPattern, '')
      .replace(basicRtfPattern, '')
      .replace(newLineSlashesPattern, '\n')
      .trim();
  }
}
