import { Component, OnInit } from '@angular/core';
import { ParserService } from './parser/parser.service';
import { IFileWithData, IRawDataFile } from '../shared/file.model';
import { FormatterService } from './formatters/formatter.service';
import { IFormat } from './formatters/format.model';
import { ISong } from '../shared/song.model';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})
export class ConvertComponent implements OnInit {
  formatsForMenu: { name: string; ext?: string }[] = [];
  selectedConversionType: string = '';

  constructor(
    private parserSvc: ParserService,
    private formatterSvc: FormatterService
  ) {}

  ngOnInit(): void {
    this.formatsForMenu = [...this.formatterSvc.formatters].map(
      (fmt: IFormat) => {
        return {
          name: fmt.friendlyName,
          ext: fmt.friendlyFileExt,
        };
      }
    );
    this.formatsForMenu.push({
      name: 'Display Slides',
    });

    //auto-select the first type
    this.selectedConversionType = this.formatsForMenu[0].name;
  }

  onSwitchConversionType(newType: string): void {
    this.selectedConversionType = newType;
  }

  onFileDrop(files: IFileWithData[]): void {
    if (files && files.length) {
      const parsedFiles = this.parserSvc.parseFiles(files);
      this.getFormattersAndConvert(parsedFiles);
    } else {
      //TODO: Show UI message
    }
  }

  getFormattersAndConvert(parsedFiles: IRawDataFile[]) {
    const converted: (ISong | undefined)[] = [];
    parsedFiles.forEach((f) => {
      const formatter = this.formatterSvc.detectFormatAndGetFormatter(f);

      //Skip formatters for unknown formats
      if (formatter) {
        converted.push(formatter.convert(f));
      }
    });

    console.log(converted);
  }
}
