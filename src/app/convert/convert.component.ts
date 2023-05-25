import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ParserService } from './parser/parser.service';
import { IOutputFile, IRawDataFile } from './models/file.model';
import { ISong } from './models/song.model';
import { IOutputConverter } from './outputs/output-converter.model';
import { ErrorsService } from './errors/errors.service';
import { ISongError } from './models/errors.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})
export class ConvertComponent implements OnInit {
  private readonly conversionTypeStorageKey = 'CONVERT_TO';
  private readonly convertedFileCountStorageKey = 'CONVERT_COUNT';

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  displayInitialUi = true;
  convertedFileCount = 0;
  readonly convertedCountMessageThreshold = 50;
  errorsList: ISongError[] = [];
  outputTypesForMenu: IOutputConverter[] = [];
  inputTypesList: { name: string; ext: string }[] = [];
  selectedOutputType!: IOutputConverter;
  convertedSongsForOutput: IOutputFile[] = [];

  constructor(
    private readonly parserSvc: ParserService,
    private readonly errorsSvc: ErrorsService
  ) {}

  ngOnInit(): void {
    this.buildOutputTypesList();
    this.buildInputTypesList();
    this.getSavedConvertedFileCount();

    //When files have finished parsing we will handle them here
    this.parserSvc.parsedFilesChanged$.subscribe((rawFiles: IRawDataFile[]) => {
      this.getConvertersAndExtractData(rawFiles);
    });

    //Updates from the error service
    this.errorsSvc.errorsChanged$.subscribe((errorsList: ISongError[]) => {
      this.errorsList = errorsList;
    });
  }

  private buildOutputTypesList(): void {
    this.outputTypesForMenu = [...this.parserSvc.outputConverters];

    const savedOutputTypePrefName = localStorage.getItem(this.conversionTypeStorageKey);
    //auto-select the saved preference, but if none auto-select the first type
    //It's possible for this to be `undefined` but very unlikely
    this.selectedOutputType =
      this.parserSvc.outputConverters.find((c) => c.name === savedOutputTypePrefName) ??
      //We know we weill always have output types in this array, so this is safe to assume here
      //We need to disable this rule here to avoid complexity elsewhere with it being possibly undefined
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.outputTypesForMenu[0]!;
  }

  private buildInputTypesList(): void {
    this.inputTypesList = this.parserSvc.inputConverters.map((ic) => {
      return { name: ic.name, ext: ic.fileExt };
    });
  }

  private getSavedConvertedFileCount(): void {
    //Restore the saved file count from any previous session
    const savedConvertedFileCount = parseInt(
      localStorage.getItem(this.convertedFileCountStorageKey) ?? '',
      10
    );
    if (!isNaN(savedConvertedFileCount) && savedConvertedFileCount > 0) {
      this.convertedFileCount = savedConvertedFileCount;
    }
  }

  onSwitchConversionType(newType: IOutputConverter, event: Event): void {
    event.preventDefault();
    this.selectedOutputType = newType;

    localStorage.setItem(this.conversionTypeStorageKey, newType.name);
  }

  onSelectFilesClick(evt: Event): void {
    //This happens when a link is clicked to manually browse for files
    evt.preventDefault();
    this.fileInput.nativeElement.click();
  }

  onFileSelect(evt: Event): void {
    //This happens when the invisible <input type="file"> element is fake-clicked
    const fileList = (evt.target as HTMLInputElement).files;
    if (fileList) {
      this.onReceiveFiles(fileList);
    }
  }

  onReceiveFiles(files: FileList): void {
    //This is either called by the appDragAndDrop directive, or by the .onFileSelect() method above
    if (files.length > 0) {
      //Clear out any old errors when parsing new files
      this.errorsSvc.clear();
      this.parserSvc.parseFiles(files);
    }
  }

  getConvertersAndExtractData(parsedFiles: IRawDataFile[]): void {
    this.displayInitialUi = false;

    const convertedSongs: ISong[] = [];
    parsedFiles.forEach((f) => {
      const fileName = f.ext !== '' ? `${f.name}.${f.ext}` : f.name;

      const converter = this.parserSvc.detectInputTypeAndGetConverter(f);

      //Skip formatters for unknown formats
      if (converter) {
        try {
          convertedSongs.push(converter.extractSongData(f));
        } catch (err: unknown) {
          this.errorsSvc.add({
            message: `There was a problem converting this file!`,
            fileName,
            thrownError: err,
          });
        }
      } else {
        this.errorsSvc.add({
          message: `This is not a file type that LyricConverter knows how to convert!`,
          fileName,
        });
      }
    });

    if (convertedSongs.length) {
      //Update the converted file count and save it
      this.convertedFileCount += convertedSongs.length;
      localStorage.setItem(this.convertedFileCountStorageKey, this.convertedFileCount.toString());

      //Convert the songs to the specified type and save them to an array
      //The array is used in template components to allow display in the UI or download
      this.convertedSongsForOutput = convertedSongs.map((s) => {
        return this.selectedOutputType.convertToType(s);
      });
    }
  }
}
