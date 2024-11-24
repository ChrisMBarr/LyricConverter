import { Component, Input } from '@angular/core';
import * as fileSaver from 'file-saver';
import * as JSZip from 'jszip';

import { IOutputFile } from '../models/file.model';
import { IOutputConverter } from '../outputs/output-converter.model';

@Component({
  selector: 'app-download-display',
  templateUrl: './download-display.component.html',
  standalone: false,
})
export class DownloadDisplayComponent {
  @Input() outputFileList: Array<IOutputFile> = [];
  @Input() selectedOutputType!: IOutputConverter;

  onClickDownloadFiles(): void {
    for (const outputFile of this.outputFileList) {
      // eslint-disable-next-line @typescript-eslint/no-deprecated -- TS selects the wrong overload and says it deprecated. It's not
      fileSaver.saveAs(
        new File(['\ufeff' + outputFile.outputContent], outputFile.fileName, {
          type: 'text/plain',
        }),
      );
    }
  }

  onClickDownloadZipFile(): void {
    const zip = new JSZip.default();

    for (const outputFile of this.outputFileList) {
      zip.file(outputFile.fileName, new File([outputFile.outputContent], outputFile.fileName));
    }

    //Generate the zip file contents
    void zip
      .generateAsync({
        type: 'blob',
      })
      .then((zipContent: Blob) => {
        // eslint-disable-next-line @typescript-eslint/no-deprecated -- TS selects the wrong overload and says it deprecated. It's not
        fileSaver.saveAs(
          zipContent,
          `LyricConverter (${this.outputFileList.length.toString()} files).zip`,
        );
      });
  }
}
