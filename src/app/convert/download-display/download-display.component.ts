import { Component, Input } from '@angular/core';
import { IOutputFile } from '../models/file.model';
import * as fileSaver from 'file-saver';
import * as JSZip from 'jszip';

@Component({
  selector: 'app-download-display',
  templateUrl: './download-display.component.html',
  styleUrls: ['./download-display.component.scss'],
})
export class DownloadDisplayComponent {
  @Input() outputFileList: IOutputFile[] = [];

  onClickDownloadFiles() {
    for (const outputFile of this.outputFileList) {
      fileSaver.saveAs(new File([outputFile.outputContent], outputFile.fileName));
    }
  }

  onClickDownloadZipFile() {
    const zip = new JSZip();

    for (const outputFile of this.outputFileList) {
      zip.file(outputFile.fileName, new File([outputFile.outputContent], outputFile.fileName));
    }

    //Generate the zip file contents
    zip
      .generateAsync({
        type: 'blob',
      })
      .then((zipContent: Blob) => {
        fileSaver.saveAs(zipContent, `LyricConverter (${this.outputFileList.length} files).zip`);
      });
  }
}
