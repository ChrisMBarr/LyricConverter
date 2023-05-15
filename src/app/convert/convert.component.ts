import { Component, OnInit } from '@angular/core';
import { ParserService } from './parser/parser.service';
import { IFileWithData, IOutputFile, IRawDataFile } from './models/file.model';
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

  displayInitialUi = true;
  outputTypesForMenu: IOutputConverter[] = [];
  selectedOutputType!: IOutputConverter;
  convertedSongsForOutput: IOutputFile[] = [];

  constructor(private parserSvc: ParserService) {}

  ngOnInit(): void {
    this.outputTypesForMenu = [...this.parserSvc.outputConverters];

    const savedOutputTypePrefName = localStorage.getItem(this.conversionTypeStorageKey);
    //auto-select the saved preference, but if none auto-select the first type
    this.selectedOutputType =
      this.parserSvc.outputConverters.find((c) => c.friendlyName === savedOutputTypePrefName) ||
      this.outputTypesForMenu[0]!;
  }

  onSwitchConversionType(newType: IOutputConverter): void {
    this.selectedOutputType = newType;

    localStorage.setItem(this.conversionTypeStorageKey, newType.friendlyName);
  }

  onFileDrop(files: IFileWithData[]): void {
    if (files && files.length) {
      this.displayInitialUi = false;
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

    if (convertedSongs.length) {
      this.convertedSongsForOutput = convertedSongs.map(s => {
        return this.selectedOutputType.convertToType(s)
      })
    } else {
      //no converted songs
    }
  }
}
