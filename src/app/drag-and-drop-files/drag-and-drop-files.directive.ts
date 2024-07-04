import { DOCUMENT } from '@angular/common';
import { Directive, EventEmitter, HostListener, Inject, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDropFiles]',
})
export class DragAndDropFilesDirective implements OnDestroy {
  private readonly dragOverClass = 'drag-over';
  @Output() readonly fileDrop = new EventEmitter<FileList>();

  constructor(@Inject(DOCUMENT) public readonly document: Document) {}

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
        this.fileDrop.emit(files);
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
}
