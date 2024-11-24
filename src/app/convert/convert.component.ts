import { DOCUMENT, NgClass } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DonateButtonComponent } from '../donate-button/donate-button.component';
import { DragAndDropFilesDirective } from '../drag-and-drop-files/drag-and-drop-files.directive';
import { DownloadDisplayComponent } from './download-display/download-display.component';
import { ErrorsService } from './errors/errors.service';
import { ISongError } from './models/errors.model';
import { IOutputFile, IRawDataFile } from './models/file.model';
import { ISong } from './models/song.model';
import { IOutputConverter } from './outputs/output-converter.model';
import { ParserService } from './parser/parser.service';
import { SlideDisplayComponent } from './slide-display/slide-display.component';

@Component({
  // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation -- This is intentional and required to allow the drag-n-srop styles to be applied as we need them here
  encapsulation: ViewEncapsulation.None,
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrl: './convert.component.css',
  imports: [
    DragAndDropFilesDirective,
    NgClass,
    DonateButtonComponent,
    SlideDisplayComponent,
    DownloadDisplayComponent,
  ],
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
  private readonly localStorage = this.document.defaultView?.localStorage;

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

    this.localStorage?.setItem(this.conversionTypeStorageKey, newType.name);
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

    let extractedSongDataArr: Array<ISong> = [];
    for (const f of parsedFiles) {
      const fileName = f.ext !== '' ? `${f.name}.${f.ext}` : f.name;

      const converter = this.parserSvc.detectInputTypeAndGetConverter(f);

      //Skip formatters for unknown formats
      if (converter) {
        try {
          const singleOrMultipleSongs = converter.extractSongData(f);
          if (Array.isArray(singleOrMultipleSongs)) {
            extractedSongDataArr = extractedSongDataArr.concat(singleOrMultipleSongs);
          } else {
            extractedSongDataArr.push(singleOrMultipleSongs);
          }
        } catch (err: unknown) {
          //Handle any errors that happen downstream on the IInputConverter for this file
          this.errorsSvc.add({
            message: `There was a problem extracting the song data from this file!`,
            fileName,
            thrownError: err,
          });
        }
      } else {
        this.showErrorForUnsupportedTypes(fileName, f.ext);
      }
    }

    if (extractedSongDataArr.length) {
      this.convertToSelectedTypes(extractedSongDataArr);
    }
  }

  private buildOutputTypesList(): void {
    this.outputTypesForMenu = [...this.parserSvc.outputConverters];

    const savedOutputTypePrefName = this.localStorage?.getItem(this.conversionTypeStorageKey);
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
      this.localStorage?.getItem(this.convertedFileCountStorageKey) ?? '',
      10,
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

  private showErrorForUnsupportedTypes(fileName: string, fileExt: string): void {
    if (fileExt === 'sc7x') {
      this.errorsSvc.add({
        message: `These type of MediaShout files cannot be read by LyricConverter. You'll need to export them as JSON files and try again. <a href="https://support.mediashout.com/244705-How-to-move-your-Song-Library-from-one-computer-to-another---MediaShout-7">Read this knowledgebase article to learn how to do that</a>`,
        fileName,
      });
    } else if (fileExt === 'pro') {
      //ChordPro files can also have a .pro extension, but they should have been accepted by that parser. That means if we got here it was rejected
      this.errorsSvc.add({
        message: `Only ProPresenter files from version 4, 5, or 6 can be ready by LyricConverter. You will have to export this files as plain text`,
        fileName,
      });
    } else {
      //Show a message if this file type cannot be converted because we don't have a way to read it
      this.errorsSvc.add({
        message: `This is not a file type that LyricConverter knows how to convert!`,
        fileName,
      });
    }
  }

  private convertToSelectedTypes(songs: Array<ISong>): void {
    //Update the converted file count and save it
    this.convertedFileCount += songs.length;
    this.localStorage?.setItem(
      this.convertedFileCountStorageKey,
      this.convertedFileCount.toString(),
    );

    const convertedSongsArr: Array<IOutputFile> = [];
    for (const s of songs) {
      try {
        //Convert the songs to the specified type and save them to an array
        //The array is used in template components to allow display in the UI or download
        convertedSongsArr.push(this.selectedOutputType.convertToType(s));
      } catch (err: unknown) {
        //Handle any errors that happen downstream on the selected IOutputConverter
        this.errorsSvc.add({
          message: `There was a problem converting this song to the ${this.selectedOutputType.name} format`,
          fileName: s.originalFile.name,
          thrownError: err,
        });
      }
    }
    this.convertedSongsForOutput = convertedSongsArr;
  }
}
