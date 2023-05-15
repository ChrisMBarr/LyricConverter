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
      fileSaver.saveAs(outputFile.file);
    }
  }

  onClickDownloadZipFile() {
    const zip = new JSZip();

    for (const outputFile of this.outputFileList) {
      zip.file(outputFile.file.name, outputFile.file);
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
