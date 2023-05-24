import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ParserService } from './parser/parser.service';
import { IFileWithData, IOutputFile, IRawDataFile } from './models/file.model';
import { ISong } from './models/song.model';
import { IOutputConverter } from './outputs/output-converter.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})
export class ConvertComponent implements OnInit {
  private readonly conversionTypeStorageKey = 'CONVERT_TO';
  // private readonly convertedFileCount = 'CONVERT_COUNT';

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  displayInitialUi = true;
  outputTypesForMenu: IOutputConverter[] = [];
  inputTypesList: { name: string; ext: string }[] = [];
  selectedOutputType!: IOutputConverter;
  convertedSongsForOutput: IOutputFile[] = [];

  constructor(private readonly parserSvc: ParserService) {}

  ngOnInit(): void {
    this.buildOutputTypesList();
    this.buildInputTypesList();
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
    //This happens when either called by .onFileSelect() above,
    // or from the appDragAndDrop directive in the template
    const loadedFiles: IFileWithData[] = [];

    for (let i = 0; i <= files.length - 1; i++) {
      const reader = new FileReader();
      const f = files[i];
      if (typeof f !== 'undefined') {
        const completeFn = this.handleFile(f, loadedFiles, files.length);
        reader.addEventListener('loadend', completeFn, false);

        //Actually read the file
        reader.readAsDataURL(f);
      }
    }
  }

  private handleFile(
    theFile: File,
    fileArray: IFileWithData[],
    fileCount: number
  ): (ev: ProgressEvent<FileReader>) => void {
    //When called, it has to return a function back up to the listener event
    return (ev: ProgressEvent<FileReader>) => {
      const fileNameParts = theFile.name.split('.');
      const fileExt = fileNameParts.length > 1 ? fileNameParts.slice(-1)[0]! : '';
      const nameWithoutExt = theFile.name.replace(`.${fileExt}`, '');

      const newFile: IFileWithData = {
        name: theFile.name,
        nameWithoutExt,
        ext: fileExt.toLowerCase(),
        type: theFile.type,
        size: theFile.size,
        lastModified: theFile.lastModified,
        data: ev.target?.result,
      };

      //Add the current file to the array
      fileArray.push(newFile);

      //Once the correct number of items have been put in the array, call the completion function
      if (fileArray.length === fileCount) {
        this.displayInitialUi = false;
        const parsedFiles = this.parserSvc.parseFiles(fileArray);
        this.getConvertersAndExtractData(parsedFiles);
      }
    };
  }

  getConvertersAndExtractData(parsedFiles: IRawDataFile[]): void {
    const convertedSongs: ISong[] = [];
    parsedFiles.forEach((f) => {
      const converter = this.parserSvc.detectInputTypeAndGetConverter(f);

      //Skip formatters for unknown formats
      if (converter) {
        convertedSongs.push(converter.extractSongData(f));
      }
    });

    if (convertedSongs.length) {
      this.convertedSongsForOutput = convertedSongs.map((s) => {
        return this.selectedOutputType.convertToType(s);
      });
    }
  }
}
