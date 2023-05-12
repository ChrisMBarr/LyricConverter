import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appDragAndDropFiles]',
})
export class DragAndDropFilesDirective {
  @Output() fileDrop = new EventEmitter<FileList>();
  @HostBinding('class.drag-over') isDraggingOver = false;

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

  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDraggingOver = false;
    if (evt.dataTransfer) {
      let files = evt.dataTransfer.files;
      if (files.length > 0) {
        this.fileDrop.emit(files);
      }
    }
  }

  constructor() {}
}
