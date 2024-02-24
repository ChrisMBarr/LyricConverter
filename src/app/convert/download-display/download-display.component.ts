import { Component, Input, inject } from '@angular/core';

import * as JSZip from 'jszip';
import * as fileSaver from 'file-saver';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

import { IOutputConverter } from '../outputs/output-converter.model';
import { IOutputFile } from '../models/file.model';

@Component({
  selector: 'app-download-display',
  templateUrl: './download-display.component.html',
})
export class DownloadDisplayComponent {
  private readonly $gaService = inject(GoogleAnalyticsService);

  @Input() outputFileList: Array<IOutputFile> = [];
  @Input() selectedOutputType!: IOutputConverter;

  onClickDownloadFiles(): void {
    for (const outputFile of this.outputFileList) {
      fileSaver.saveAs(
        new File(['\ufeff' + outputFile.outputContent], outputFile.fileName, {
          type: 'text/plain',
        }),
      );
    }

    this.$gaService.event(
      'file_download',
      this.selectedOutputType.name,
      'files',
      this.outputFileList.length,
      true,
    );
  }

  onClickDownloadZipFile(): void {
    const zip = new JSZip();

    for (const outputFile of this.outputFileList) {
      zip.file(outputFile.fileName, new File([outputFile.outputContent], outputFile.fileName));
    }

    //Generate the zip file contents
    void zip
      .generateAsync({
        type: 'blob',
      })
      .then((zipContent: Blob) => {
        fileSaver.saveAs(zipContent, `LyricConverter (${this.outputFileList.length} files).zip`);

        this.$gaService.event(
          'file_download',
          this.selectedOutputType.name,
          'zip',
          this.outputFileList.length,
          true,
        );
      });
  }
}
