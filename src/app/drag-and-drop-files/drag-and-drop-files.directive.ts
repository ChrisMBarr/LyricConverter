import { Directive, EventEmitter, HostListener, Output, Inject, OnDestroy } from '@angular/core';
import { IFileWithData } from '../convert/models/file.model';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[appDragAndDropFiles]',
})
export class DragAndDropFilesDirective implements OnDestroy {
  private readonly dragOverClass = 'drag-over';
  @Output() fileDrop = new EventEmitter<IFileWithData[]>();

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  ngOnDestroy(): void {
    this.toggleDragOver(false);
  }

  //Dragover listener, when something is dragged over our host element
  @HostListener('document:dragover', ['$event']) onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.toggleDragOver(true);
  }

  //Dragleave listener, when something is dragged away from our host element
  @HostListener('document:dragleave', ['$event']) public onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();

    //This event fires too often, when changing which element you are hovered over,
    // which causes the CSS animation to flash as it partially transitions
    // By checking the mouse coordinates now it will only fire when the cursor has truly left the page
    if (evt.x === 0 && evt.y === 0) {
      this.toggleDragOver(false);
    }
  }

  @HostListener('document:drop', ['$event']) public onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.toggleDragOver(false);

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

  private toggleDragOver(isOver: boolean): void {
    if (isOver) {
      this.document.body.classList.add(this.dragOverClass);
    } else {
      this.document.body.classList.remove(this.dragOverClass);
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
        this.fileDrop.emit(fileArray);
      }
    };
  }
}
