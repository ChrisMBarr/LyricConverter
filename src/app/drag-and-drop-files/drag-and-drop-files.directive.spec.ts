import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DragAndDropFilesDirective } from './drag-and-drop-files.directive';
import { IFileWithData } from '../convert/models/file.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { first } from 'rxjs';

describe('DragAndDropFilesDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let debugEl: DebugElement;
  let directiveInstance: DragAndDropFilesDirective;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [DragAndDropFilesDirective, TestComponent],
    }).createComponent(TestComponent);

    debugEl = fixture.debugElement.query(
      By.directive(DragAndDropFilesDirective)
    );

    directiveInstance = debugEl.injector.get(DragAndDropFilesDirective);
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    let directive = new DragAndDropFilesDirective();
    expect(directive).toBeTruthy();
  });

  describe('Drag in/out - Preventing default events', () => {
    //https://stackoverflow.com/questions/48931164/angular-how-to-test-hostlistener

    it('should prevent dragover event', () => {
      const event = new DragEvent('dragover', { cancelable: true });

      debugEl.nativeElement.dispatchEvent(event);
      fixture.detectChanges();

      expect(event.defaultPrevented).toBeTruthy();
    });

    it('should prevent dragleave event', () => {
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragover', { cancelable: true })
      );
      fixture.detectChanges();

      const eventLeave = new DragEvent('dragleave', { cancelable: true });
      debugEl.nativeElement.dispatchEvent(eventLeave);
      fixture.detectChanges();

      expect(eventLeave.defaultPrevented).toBeTruthy();
    });

    it('should prevent drop event', () => {
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragover', { cancelable: true })
      );
      fixture.detectChanges();

      const eventDrop = new DragEvent('drop', { cancelable: true });
      debugEl.nativeElement.dispatchEvent(eventDrop);
      fixture.detectChanges();

      expect(eventDrop.defaultPrevented).toBeTruthy();
    });
  });

  describe('Drag in/out - add/remove CSS class', () => {
    it('should add a class when dragged over', () => {
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragover', { cancelable: true })
      );
      fixture.detectChanges();

      expect(debugEl.attributes['class']).toContain('drag-over');
    });

    it('should remove a class when drag leave', () => {
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragover', { cancelable: true })
      );
      fixture.detectChanges();
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragleave', { cancelable: true })
      );
      fixture.detectChanges();

      expect(debugEl.attributes['class']).not.toContain('drag-over');
    });

    it('should remove a class when files dropped', () => {
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragover', { cancelable: true })
      );
      fixture.detectChanges();
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('drop', { cancelable: true })
      );
      fixture.detectChanges();

      expect(debugEl.attributes['class']).not.toContain('drag-over');
    });
  });

  describe('Drag in/out - isDraggingOver', () => {
    it('should be true when dragged over', () => {
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragover', { cancelable: true })
      );
      fixture.detectChanges();

      expect(directiveInstance.isDraggingOver).toBeTrue();
    });

    it('should remove a class when drag leave', () => {
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragover', { cancelable: true })
      );
      fixture.detectChanges();

      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragleave', { cancelable: true })
      );
      fixture.detectChanges();

      expect(directiveInstance.isDraggingOver).toBeFalse();
    });

    it('should remove a class when files dropped', () => {
      debugEl.nativeElement.dispatchEvent(
        new DragEvent('dragover', { cancelable: true })
      );
      fixture.detectChanges();

      debugEl.nativeElement.dispatchEvent(
        new DragEvent('drop', { cancelable: true })
      );
      fixture.detectChanges();

      expect(directiveInstance.isDraggingOver).toBeFalse();
    });
  });

  describe('File Dropping', () => {
    it('should call readFile() when dropping a file', () => {
      spyOn(directiveInstance, 'readFiles');

      const file = new File(['this is file content!'], 'dummy.txt');
      const dt = new DataTransfer();
      dt.items.add(file);
      dt.items.add(file);

      const fakeEvent = new DragEvent('drop', {
        cancelable: true,
        dataTransfer: dt,
      });

      debugEl.nativeElement.dispatchEvent(fakeEvent);
      fixture.detectChanges();

      expect(directiveInstance.readFiles).toHaveBeenCalled();
    });

    it('should emit the list of files', (done: DoneFn) => {
      spyOn(directiveInstance.fileDrop, 'emit').and.callThrough();

      const fileCreationTime = Date.now();
      const dt = new DataTransfer();
      dt.items.add(
        new File(['this is some plain text file content!'], 'UPPERCASE.WITH.DOTS.TXT', {
          lastModified: fileCreationTime,
          type:'text/plain'
        })
      );
      dt.items.add(
        new File(['this is a PP5 file!'], 'lowercase-file.pro5', {
          lastModified: fileCreationTime,
          type:''
        })
      );

      directiveInstance.fileDrop
        .pipe(first())
        .subscribe((outputFiles: IFileWithData[]) => {
          expect(directiveInstance.fileDrop.emit).toHaveBeenCalled();
          expect(outputFiles.length).toBe(2);
          expect(outputFiles).toEqual([
            {
              name: 'UPPERCASE.WITH.DOTS.TXT',
              nameWithoutExt: 'UPPERCASE.WITH.DOTS',
              ext: 'txt',
              type: 'text/plain',
              size: 37,
              lastModified: fileCreationTime,
              data: 'data:text/plain;base64,dGhpcyBpcyBzb21lIHBsYWluIHRleHQgZmlsZSBjb250ZW50IQ==',
            },
            {
              name: 'lowercase-file.pro5',
              nameWithoutExt: 'lowercase-file',
              ext: 'pro5',
              type: '',
              size: 19,
              lastModified: fileCreationTime,
              data: 'data:application/octet-stream;base64,dGhpcyBpcyBhIFBQNSBmaWxlIQ==',
            },
          ]);

          done();
        });

      directiveInstance.readFiles(dt.files);
      fixture.detectChanges();
    });
  });

  @Component({
    template: `<div appDragAndDropFiles (fileDrop)="onFileDrop($event)"></div>`,
  })
  class TestComponent {
    filesFromDirective: IFileWithData[] = [];
    onFileDrop(files: IFileWithData[]): void {
      this.filesFromDirective = files;
    }
  }
});
