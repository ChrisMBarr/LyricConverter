import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DownloadDisplayComponent } from './download-display.component';
import { By } from '@angular/platform-browser';
import * as fileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { mockOutputFiles } from 'test/mock-output-files';
import { deepClone } from 'test/test-utils';

describe('DownloadDisplayComponent', () => {
  let component: DownloadDisplayComponent;
  let fixture: ComponentFixture<DownloadDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadDisplayComponent],
    });
    fixture = TestBed.createComponent(DownloadDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UI display & clicks', () => {
    it('should display a single button when one file is passed', () => {
      const mockFilesCopy = deepClone(mockOutputFiles[0]!);
      component.outputFileList = [mockFilesCopy];

      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('.btn')).length).toEqual(1);
      expect(fixture.debugElement.query(By.css('.btn')).nativeElement.textContent.trim()).toEqual(
        'Download File'
      );
    });

    it('should call onClickDownloadFiles() when the button for a single file is clicked', () => {
      const mockFilesCopy = deepClone(mockOutputFiles[0]!);
      component.outputFileList = [mockFilesCopy];

      spyOn(component, 'onClickDownloadFiles');
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.btn')).triggerEventHandler('click');

      expect(component.onClickDownloadFiles).toHaveBeenCalled();
    });

    it('should display two buttons when multiple files are passed', () => {
      component.outputFileList = deepClone(mockOutputFiles);

      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('.btn')).length).toEqual(2);
      expect(
        fixture.debugElement.query(By.css('.btn:nth-of-type(1)')).nativeElement.textContent.trim()
      ).toEqual('Download as .zip');
      expect(
        fixture.debugElement.query(By.css('.btn:nth-of-type(2)')).nativeElement.textContent.trim()
      ).toEqual('Download 2 individual files');
    });

    it('should call onClickDownloadZipFile() when multiple files are passed and the "download as .zip" button is clicked', () => {
      component.outputFileList = deepClone(mockOutputFiles);

      spyOn(component, 'onClickDownloadZipFile');
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.btn:nth-of-type(1)')).triggerEventHandler('click');

      expect(component.onClickDownloadZipFile).toHaveBeenCalled();
    });

    it('should call onClickDownloadFiles() when multiple files are passed and the "download individual files" button is clicked', () => {
      component.outputFileList = deepClone(mockOutputFiles);

      spyOn(component, 'onClickDownloadFiles');
      fixture.detectChanges();

      fixture.debugElement.query(By.css('.btn:nth-of-type(2)')).triggerEventHandler('click');

      expect(component.onClickDownloadFiles).toHaveBeenCalled();
    });
  });

  describe('Download Functionality', () => {
    it('should call the fileSaver library once, to save a song file, when onClickDownloadFiles() is called with one passed in file', () => {
      const mockFilesCopy = deepClone(mockOutputFiles[0]!);
      component.outputFileList = [mockFilesCopy];

      spyOn(fileSaver, 'saveAs');
      component.onClickDownloadFiles();

      expect(fileSaver.saveAs).toHaveBeenCalledTimes(1);
    });

    it('should call the fileSaver library multiple times, to save song files, when onClickDownloadFiles() is called with multiple passed in files', () => {
      component.outputFileList = deepClone(mockOutputFiles);

      spyOn(fileSaver, 'saveAs');
      component.onClickDownloadFiles();

      expect(fileSaver.saveAs).toHaveBeenCalledTimes(2);
    });

    it('should call the fileSaver library once, to save a ZIP file, when onClickDownloadZipFile() is called with multiple passed in files', fakeAsync(() => {
      component.outputFileList = deepClone(mockOutputFiles);

      spyOn(JSZip.prototype, 'file').and.callThrough()
      spyOn(JSZip.prototype, 'generateAsync').and.returnValue(Promise.resolve('some blob'));
      spyOn(fileSaver, 'saveAs');

      component.onClickDownloadZipFile();
      tick();

      expect(fileSaver.saveAs).toHaveBeenCalled();
    }));
  });
});
