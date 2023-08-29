import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

//Helpers & Types
import { IFileWithData, IRawDataFile } from '../models/file.model';
import { IInputConverter } from '../inputs/input-converter.model';
import { IOutputConverter } from '../outputs/output-converter.model';

//Input Types
import { InputTypeProPresenter4 } from '../inputs/input-type-propresenter4';
import { InputTypeProPresenter5 } from '../inputs/input-type-propresenter5';
import { InputTypeProPresenter6 } from '../inputs/input-type-propresenter6';
import { InputTypeChordPro } from '../inputs/input-type-chordpro';
import { InputTypeSongPro } from '../inputs/input-type-songpro';
import { InputTypeSongShowPlus7 } from '../inputs/input-type-songshowplus7';
import { InputTypeOpenLyrics } from '../inputs/input-type-openlyrics';
import { InputTypePlainText } from '../inputs/input-type-plain-text';
import { InputTypeJSON } from '../inputs/input-type-json';

//Output Types
import { OutputTypeProPresenter5 } from '../outputs/output-type-propresenter5';
import { OutputTypeChordpro } from '../outputs/output-type-chordpro';
import { OutputTypeOpenLyrics } from '../outputs/output-type-openlyrics';
import { OutputTypeSongPro } from '../outputs/output-type-songpro';
import { OutputTypePlainText } from '../outputs/output-type-plain-text';
import { OutputTypeJSON } from '../outputs/output-type-json';
import { OutputTypeDisplaySlides } from '../outputs/output-type-display-slides';
import { ErrorsService } from '../errors/errors.service';
import { OutputTypeProPresenter6 } from '../outputs/output-type-propresenter6';

@Injectable({
  providedIn: 'root',
})
export class ParserService {
  //List of all available Input Converters
  readonly inputConverters: IInputConverter[] = [
    new InputTypeProPresenter4(),
    new InputTypeProPresenter5(),
    new InputTypeProPresenter6(),
    new InputTypeChordPro(),
    new InputTypeSongPro(),
    new InputTypeSongShowPlus7(),
    new InputTypeOpenLyrics(),
    new InputTypePlainText(),
    new InputTypeJSON(),
  ];

  readonly outputConverters: IOutputConverter[] = [
    new OutputTypeProPresenter6(),
    new OutputTypeProPresenter5(),
    new OutputTypeChordpro(),
    new OutputTypeOpenLyrics(),
    new OutputTypeSongPro(),
    new OutputTypePlainText(),
    new OutputTypeJSON(),
    new OutputTypeDisplaySlides(),
  ];

  parsedFilesChanged$ = new Subject<IRawDataFile[]>();

  constructor(private readonly errorsSvc: ErrorsService) {}

  parseFiles(files: FileList): void {
    try {
      const loadedFiles: IFileWithData[] = [];

      for (let i = 0; i <= files.length - 1; i++) {
        const reader = new FileReader();
        //This cannot be null since it's in the list that came here
        const f = files[i]!; //eslint-disable-line @typescript-eslint/no-non-null-assertion
        //File reading happens async
        //Set up an event for what to do when the file has finished being read
        const completeFn = this.handleFile(f, loadedFiles, files.length);
        reader.addEventListener('loadend', completeFn, false);

        //Actually read the file, but as an array buffer
        //Some input types needs this raw data, others will just convert it to a string to be parsed
        reader.readAsArrayBuffer(f);
      }
    } catch (err: unknown) {
      this.errorsSvc.add({
        message: `There was a problem reading one of the files`,
        thrownError: err,
      });
    }
  }

  detectInputTypeAndGetConverter(f: IRawDataFile): IInputConverter | undefined {
    return this.inputConverters.find((c: IInputConverter) => {
      return c.doesInputFileMatchThisType(f);
    });
  }

  private handleFile(
    theFile: File,
    fileArray: IFileWithData[],
    fileCount: number
  ): (ev: ProgressEvent<FileReader>) => void {
    //When called, it has to return a function back up to the listener event
    return (ev: ProgressEvent<FileReader>) => {
      const fileNameParts = theFile.name.split('.');
      const fileExt = fileNameParts.length > 1 ? fileNameParts.slice(-1)[0]! : ''; //eslint-disable-line @typescript-eslint/no-non-null-assertion
      const nameWithoutExt = theFile.name.replace(`.${fileExt}`, '');

      if (ev.target?.result != null) {
        const newFile: IFileWithData = {
          name: theFile.name,
          nameWithoutExt,
          ext: fileExt.toLowerCase(),
          type: theFile.type,
          size: theFile.size,
          lastModified: theFile.lastModified,
          bufferData: ev.target.result as ArrayBuffer,
        };

        //Add the current file to the array
        fileArray.push(newFile);
      }
      //Once all the files have been read and converted should we continue
      if (fileArray.length === fileCount) {
        this.emitRawFiles(fileArray);
      }
    };
  }

  private emitRawFiles(files: IFileWithData[]): void {
    const rawDataFiles: IRawDataFile[] = [];
    for (const f of files) {



      rawDataFiles.push({
        name: f.nameWithoutExt,
        ext: f.ext,
        type: f.type,
        dataAsBuffer: f.bufferData,
        dataAsString: ''
      });
    }

    this.parsedFilesChanged$.next(rawDataFiles);
  }
}
