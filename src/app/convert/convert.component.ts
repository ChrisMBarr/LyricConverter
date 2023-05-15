import { Component, OnInit } from '@angular/core';
import { ParserService } from './parser/parser.service';
import { IFileWithData, IRawDataFile } from './models/file.model';
import { ISong } from './models/song.model';
import { IOutputConverter } from './outputs/output-converter.model';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})
export class ConvertComponent implements OnInit {
  private readonly conversionTypeStorageKey = 'CONVERT_TO';
  // private readonly convertedFileCount = 'CONVERT_COUNT';

  outputTypesForMenu: { name: string; ext?: string }[] = [];
  selectedConversionType: string = '';

  constructor(
    private parserSvc: ParserService
  ) {}

  ngOnInit(): void {
    this.outputTypesForMenu = [...this.parserSvc.outputConverters].map(
      (outputConverter: IOutputConverter) => {
        return {
          name: outputConverter.friendlyName,
          ext: outputConverter.friendlyFileExt,
        };
      }
    );
    this.outputTypesForMenu.push({
      name: 'Display Slides',
    });

    //auto-select the saved preference, but if none auto-select the first type
    this.selectedConversionType =
      localStorage.getItem(this.conversionTypeStorageKey) ||
      this.outputTypesForMenu[0].name;
  }

  onSwitchConversionType(newType: string): void {
    this.selectedConversionType = newType;

    localStorage.setItem(this.conversionTypeStorageKey, newType);
  }

  onFileDrop(files: IFileWithData[]): void {
    if (files && files.length) {
      const parsedFiles = this.parserSvc.parseFiles(files);
      this.getConvertersAndExtractData(parsedFiles);
    } else {
      //TODO: Show UI message
    }
  }

  getConvertersAndExtractData(parsedFiles: IRawDataFile[]) {
    const convertedSongs: ISong[] = [];
    parsedFiles.forEach((f) => {
      const converter = this.parserSvc.detectInputTypeAndGetConverter(f);

      //Skip formatters for unknown formats
      if (converter) {
        convertedSongs.push(converter.extractSongData(f));
      }
    });

    console.log(convertedSongs);

    if (convertedSongs.length) {
      if (this.selectedConversionType === 'display') {
        //Show the slides in the UI
      } else {
        //A file download preference
      }
    } else {
      //no converted songs
    }
  }
}
