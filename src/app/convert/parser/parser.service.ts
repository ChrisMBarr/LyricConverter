import { Injectable } from '@angular/core';
import { IFileWithData, IRawDataFile } from '../../shared/file.model';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  constructor() {}

  parseFiles(files: IFileWithData[]) {
    const rawDataFiles: IRawDataFile[] = [];
    for (const f of files) {
      let data = '';

      if(typeof f.data === 'string'){
        data = this.decode(f.data.replace(/^data:.*;base64,/, ''));
      }

      rawDataFiles.push({
        name: f.nameWithoutExt,
        ext: f.ext,
        type: f.type,
        data
      });
    }

    console.log(rawDataFiles);
  }

  decode = (base64Str: string) => window.atob(base64Str);
  encode = (str: string) => window.btoa(str);

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
