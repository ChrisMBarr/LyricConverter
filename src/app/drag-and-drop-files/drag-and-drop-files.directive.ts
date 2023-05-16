import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';
import { IFileWithData } from '../convert/models/file.model';

@Directive({
  selector: '[appDragAndDropFiles]',
})
export class DragAndDropFilesDirective {
  @Output() fileDrop = new EventEmitter<IFileWithData[]>();
  @HostBinding('class.drag-over') isDraggingOver = false;

  //Dragover listener, when something is dragged over our host element
  @HostListener('dragover', ['$event']) onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggingOver = true;
  }

  //Dragleave listener, when something is dragged away from our host element
  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggingOver = false;
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggingOver = false;
    if (evt.dataTransfer) {
      const files = evt.dataTransfer.files;
      if (files.length > 0) {
        this.readFiles(files);
      }
    }
  }

  readFiles(files: FileList): void {
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
      const fileExt = theFile.name.includes('.') ? theFile.name.split('.').slice(-1)[0] : '';
      const nameWithoutExt = theFile.name.replace(`.${fileExt}`, '');

      const newFile: IFileWithData = {
        name: theFile.name,
        nameWithoutExt: nameWithoutExt,
        ext: (fileExt || '').toLowerCase(),
        type: theFile.type,
        size: theFile.size,
        lastModified: theFile.lastModified,
        data: ev.target?.result,
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
