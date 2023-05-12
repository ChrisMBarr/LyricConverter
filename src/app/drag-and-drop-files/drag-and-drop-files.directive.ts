import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';
import { IFileWithData } from '../shared/file.model';

@Directive({
  selector: '[appDragAndDropFiles]',
})
export class DragAndDropFilesDirective {
  @Output() fileDrop = new EventEmitter<IFileWithData[]>();
  @HostBinding('class.drag-over') isDraggingOver = false;

  constructor(){}

  //Dragover listener, when something is dragged over our host element
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggingOver = true;
  }

  //Dragleave listener, when something is dragged away from our host element
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggingOver = false;
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggingOver = false;
    if (evt.dataTransfer) {
      let files = evt.dataTransfer.files;
      if (files.length > 0) {
        this.readFiles(files);
      }
    }
  }

  readFiles(files: FileList) {
    const loadedFiles: IFileWithData[] = [];

    for (var i = 0; i <= files.length - 1; i++) {
      const reader = new FileReader();
      var completeFn = this.handleFile(files[i], loadedFiles, files.length);
      reader.addEventListener('loadend', completeFn, false);

      //Actually read the file
      reader.readAsDataURL(files[i]);
    }
  }

  private handleFile(theFile: File, fileArray: IFileWithData[], fileCount: number) {
    //When called, it has to return a function back up to the listener event
    return (ev: ProgressEvent<FileReader>) => {
      const fileExt = theFile.name.split('.').slice(-1)[0];
      const nameWithoutExt = theFile.name.replace(`.${fileExt}`, '');

      const newFile: IFileWithData = {
        name: theFile.name,
        nameWithoutExt: nameWithoutExt,
        ext: fileExt.toLowerCase(),
        type: theFile.type,
        size: theFile.size,
        lastModified: theFile.lastModified,
        data: ev.target?.result
      };

      //Add the current file to the array
      fileArray.push(newFile);

      //Once the correct number of items have been put in the array, call the completion function
      if (fileArray.length === fileCount) {
        this.fileDrop.emit(fileArray);
      }
    };
  }
}
