import { Component, DebugElement, Inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { first } from 'rxjs';

import { DragAndDropFilesDirective } from './drag-and-drop-files.directive';
import { IFileWithData } from '../convert/models/file.model';

describe('DragAndDropFilesDirective', () => {
  //---------------------------------------------
  @Component({
    template: `<div appDragAndDropFiles (fileDrop)="onFileDrop($event)"></div>`,
  })
  class TestComponent {
    filesFromDirective: Array<IFileWithData> = [];
    onFileDrop(files: Array<IFileWithData>): void {
      this.filesFromDirective = files;
    }
  }
  //---------------------------------------------

  let injectedDocument: Document;
  let fixture: ComponentFixture<TestComponent>;
  let debugEl: DebugElement;
  let directiveInstance: DragAndDropFilesDirective;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [DragAndDropFilesDirective, TestComponent],
    }).createComponent(TestComponent);

    injectedDocument = Inject(DOCUMENT) as Document;
    debugEl = fixture.debugElement.query(By.directive(DragAndDropFilesDirective));

    directiveInstance = debugEl.injector.get(DragAndDropFilesDirective);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new DragAndDropFilesDirective(injectedDocument);
    expect(directive).toBeTruthy();
  });

  describe('Drag in/out - Preventing default events', () => {
    //https://stackoverflow.com/questions/48931164/angular-how-to-test-hostlistener

    it('should prevent dragover event', () => {
      const event = new DragEvent('dragover', { cancelable: true });

      directiveInstance.document.dispatchEvent(event);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBeTruthy();
    });

    it('should prevent dragleave event', () => {
      directiveInstance.document.dispatchEvent(new DragEvent('dragover', { cancelable: true }));
      fixture.detectChanges();

      const eventLeave = new DragEvent('dragleave', { cancelable: true });
      directiveInstance.document.dispatchEvent(eventLeave);
      fixture.detectChanges();

      expect(eventLeave.defaultPrevented).toBeTruthy();
    });

    it('should prevent drop event', () => {
      directiveInstance.document.dispatchEvent(new DragEvent('dragover', { cancelable: true }));
      fixture.detectChanges();

      const eventDrop = new DragEvent('drop', { cancelable: true });
      directiveInstance.document.dispatchEvent(eventDrop);
      fixture.detectChanges();

      expect(eventDrop.defaultPrevented).toBeTruthy();
    });
  });

  describe('Drag in/out - add/remove CSS class', () => {
    it('should add a class to the document body when dragged over', () => {
      directiveInstance.document.dispatchEvent(new DragEvent('dragover', { cancelable: true }));
      fixture.detectChanges();

      expect(directiveInstance.document.body.attributes.getNamedItem('class')?.value).toContain('drag-over');
    });

    it('should remove a class when drag leave', () => {
      directiveInstance.document.dispatchEvent(new DragEvent('dragover', { cancelable: true }));
      fixture.detectChanges();
      directiveInstance.document.dispatchEvent(new DragEvent('dragleave', { cancelable: true }));
      fixture.detectChanges();

      expect(directiveInstance.document.body.attributes.getNamedItem('class')?.value).not.toContain('drag-over');
    });

    it('should remove a class when files dropped', () => {
      directiveInstance.document.dispatchEvent(new DragEvent('dragover', { cancelable: true }));
      fixture.detectChanges();
      directiveInstance.document.dispatchEvent(new DragEvent('drop', { cancelable: true }));
      fixture.detectChanges();

      expect(directiveInstance.document.body.attributes.getNamedItem('class')?.value).not.toContain('drag-over');
    });
  });

  describe('File Dropping', () => {
    it('should emit the list of files', (done: DoneFn) => {
      spyOn(directiveInstance.fileDrop, 'emit').and.callThrough();

      const fileCreationTime = Date.now();
      const dt = new DataTransfer();
      dt.items.add(
        new File(['this is some plain text file content!'], 'UPPERCASE.WITH.DOTS.TXT', {
          lastModified: fileCreationTime,
          type: 'text/plain',
        }),
      );
      dt.items.add(
        new File(['this file has no extension!'], 'no-extension', {
          lastModified: fileCreationTime,
          type: '',
        }),
      );
      dt.items.add(
        new File(['this is a PP5 file!'], 'lowercase-file.pro5', {
          lastModified: fileCreationTime,
          type: '',
        }),
      );

      directiveInstance.fileDrop.pipe(first()).subscribe((outputFiles: FileList) => {
        expect(directiveInstance.fileDrop.emit).toHaveBeenCalled();

        //It'd difficult to test the specific properties of a File object,
        // so as long as we have the correct number of files with the correct names we are good to go
        expect(outputFiles.length).withContext('Number of emitted files').toEqual(3);
        expect(outputFiles.item(0)?.name).withContext('Emitted file #1 name').toEqual('UPPERCASE.WITH.DOTS.TXT');
        expect(outputFiles.item(1)?.name).withContext('Emitted file #2 name').toEqual('no-extension');
        expect(outputFiles.item(2)?.name).withContext('Emitted file #3 name').toEqual('lowercase-file.pro5');

        done();
      });

      directiveInstance.document.dispatchEvent(new DragEvent('drop', { cancelable: true, dataTransfer: dt }));
      fixture.detectChanges();
    });
  });
});
