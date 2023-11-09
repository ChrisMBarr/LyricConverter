import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IOutputFile, IRawDataFile } from './models/file.model';
import { ErrorsService } from './errors/errors.service';
import { IOutputConverter } from './outputs/output-converter.model';
import { ISong } from './models/song.model';
import { ISongError } from './models/errors.model';
import { ParserService } from './parser/parser.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.css'],
})
export class ConvertComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly elementRef = inject(ElementRef);
  private readonly parserSvc = inject(ParserService);
  private readonly errorsSvc = inject(ErrorsService);

  private readonly conversionTypeStorageKey = 'CONVERT_TO';
  private readonly convertedFileCountStorageKey = 'CONVERT_COUNT';
  private readonly window: Window = this.document.defaultView as Window;

  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  displayInitialUi = true;
  convertedFileCount = 0;
  readonly convertedCountMessageThreshold = 50;
  errorsList: Array<ISongError> = [];
  outputTypesForMenu: Array<IOutputConverter> = [];
  inputTypesList: Array<{ name: string; ext: string }> = [];
  selectedOutputType!: IOutputConverter;
  convertedSongsForOutput: Array<IOutputFile> = [];

  ngOnInit(): void {
    this.buildOutputTypesList();
    this.buildInputTypesList();
    this.getSavedConvertedFileCount();

    //When files have finished parsing we will handle them here
    this.parserSvc.parsedFilesChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((rawFiles: Array<IRawDataFile>) => {
        this.getConvertersAndExtractData(rawFiles);
      });

    //Updates from the error service
    this.errorsSvc.errorsChanged$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((errorsList: Array<ISongError>) => {
        this.errorsList = errorsList;
      });
  }

  onSwitchConversionType(newType: IOutputConverter, event: Event): void {
    event.preventDefault();
    this.displayInitialUi = true;
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

  getConvertersAndExtractData(parsedFiles: Array<IRawDataFile>): void {
    this.displayInitialUi = false;
    this.scrollBackToTop();

    const convertedSongs: Array<ISong> = [];
    for (const f of parsedFiles) {
      const fileName = f.ext !== '' ? `${f.name}.${f.ext}` : f.name;

      const converter = this.parserSvc.detectInputTypeAndGetConverter(f);

      //Skip formatters for unknown formats
      if (converter) {
        try {
          convertedSongs.push(converter.extractSongData(f));
        } catch (err: unknown) {
          //Handle any errors that happen downstream on the IInputConverter for this file
          this.errorsSvc.add({
            message: `There was a problem extracting the song data from this file!`,
            fileName,
            thrownError: err,
          });
        }
      } else {
        //Show a message if this file type cannot be converted because we don't have a way to read it
        this.errorsSvc.add({
          message: `This is not a file type that LyricConverter knows how to convert!`,
          fileName,
        });
      }
    }

    if (convertedSongs.length) {
      //Update the converted file count and save it
      this.convertedFileCount += convertedSongs.length;
      localStorage.setItem(this.convertedFileCountStorageKey, this.convertedFileCount.toString());

      const convertedSongsArr: Array<IOutputFile> = [];
      for (const s of convertedSongs) {
        try {
          //Convert the songs to the specified type and save them to an array
          //The array is used in template components to allow display in the UI or download
          convertedSongsArr.push(this.selectedOutputType.convertToType(s));
        } catch (err: unknown) {
          //Handle any errors that happen downstream on the selected IOutputConverter
          this.errorsSvc.add({
            message: `There was a problem converting this song to the ${this.selectedOutputType.name} format`,
            fileName: s.fileName,
            thrownError: err,
          });
        }
      }
      this.convertedSongsForOutput = convertedSongsArr;
    }
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

  private scrollBackToTop(): void {
    const thisComponentEl = this.elementRef.nativeElement as HTMLElement;
    const elTop = thisComponentEl.offsetTop;
    this.window.scrollTo({ top: elTop, behavior: 'smooth' });
  }
}
