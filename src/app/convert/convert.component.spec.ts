import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ConvertComponent } from './convert.component';
import { DonateButtonComponent } from '../donate-button/donate-button.component';
import { ParserService } from './parser/parser.service';
import { DragAndDropFilesDirective } from '../drag-and-drop-files/drag-and-drop-files.directive';
import { SlideDisplayComponent } from './slide-display/slide-display.component';
import { DownloadDisplayComponent } from './download-display/download-display.component';
import { OutputTypeDisplaySlides } from './outputs/output-type-display-slides';
import { OutputTypeText } from './outputs/output-type-text';

describe('ConvertComponent', () => {
  let component: ConvertComponent;
  let fixture: ComponentFixture<ConvertComponent>;
  let parserSvc: ParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConvertComponent,
        DonateButtonComponent,
        DragAndDropFilesDirective,
        SlideDisplayComponent,
        DownloadDisplayComponent,
      ],
    });
    parserSvc = TestBed.inject(ParserService);

    fixture = TestBed.createComponent(ConvertComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Output Menu UI', () => {
    const prefKey = 'CONVERT_TO';

    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should build a list of all available output types to convert to', () => {
      fixture.detectChanges();

      expect(component.outputTypesForMenu).toEqual([
        new OutputTypeText(),
        new OutputTypeDisplaySlides(),
      ]);
    });

    it('should auto-select the first type to convert to when no preference is saved', () => {
      fixture.detectChanges();
      expect(component.selectedOutputType.name).toEqual('Plain Text');
    });

    it('should auto-select the saved type to convert to when a preference is saved', () => {
      localStorage.setItem(prefKey, 'Text');
      fixture.detectChanges();
      expect(component.selectedOutputType.name).toEqual('Plain Text');
    });

    it('should change the conversion type when switchConversionType() is called', () => {
      fixture.detectChanges();
      component.onSwitchConversionType(new OutputTypeDisplaySlides());
      fixture.detectChanges();
      expect(component.selectedOutputType.name).toEqual('Display Slides');
    });

    xit('should change the conversion type when a link in the menu is clicked', () => {
      fixture.detectChanges();

      fixture.debugElement
        .query(By.css('#convert-types .list-group-item:nth-of-type(1)'))
        .triggerEventHandler('click');

      fixture.detectChanges();
      expect(component.selectedOutputType.name).toEqual('Display Slides');
    });

    xit('should save the conversion type preference when a link in the menu is clicked', () => {
      fixture.detectChanges();

      fixture.debugElement
        .query(By.css('#convert-types .list-group-item:nth-of-type(1)'))
        .triggerEventHandler('click');

      fixture.detectChanges();
      expect(localStorage.getItem(prefKey)).toEqual('Display Slides');
    });
  });

  it('should show the initial UI', () => {
    fixture.detectChanges();
    expect(component.displayInitialUi).toBeTrue();
    expect(fixture.debugElement.query(By.css('#begin-area'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#drop-area-more'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#display-area'))).toBeNull();
  });

  it('should show the display UI when the "display slides" output is selected after files are dropped', () => {
    fixture.detectChanges();
    component.selectedOutputType = new OutputTypeDisplaySlides();

    component.onFileDrop([
      {
        name: 'UPPERCASE.WITH.DOTS.TXT',
        nameWithoutExt: 'UPPERCASE.WITH.DOTS',
        ext: 'txt',
        type: 'text/plain',
        size: 37,
        lastModified: Date.now(),
        data: 'data:text/plain;base64,dGhpcyBpcyBzb21lIHBsYWluIHRleHQgZmlsZSBjb250ZW50IQ==',
      },
      {
        name: 'lowercase-file.pro5',
        nameWithoutExt: 'lowercase-file',
        ext: 'pro5',
        type: '',
        size: 19,
        lastModified: Date.now(),
        data: 'data:application/octet-stream;base64,dGhpcyBpcyBhIFBQNSBmaWxlIQ==',
      },
    ]);

    fixture.detectChanges();

    expect(component.displayInitialUi).toBeFalse();
    expect(fixture.debugElement.query(By.css('#begin-area'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#drop-area-more'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#display-area'))).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css('#display-area')).query(By.directive(SlideDisplayComponent))
    ).not.toBeNull();
    expect(
      fixture.debugElement
        .query(By.css('#display-area'))
        .query(By.directive(DownloadDisplayComponent))
    ).toBeNull();
  });

  it('should show the download UI when anything but the "display slides" output is selected after files are dropped', () => {
    fixture.detectChanges();
    component.selectedOutputType = new OutputTypeText();

    component.onFileDrop([
      {
        name: 'UPPERCASE.WITH.DOTS.TXT',
        nameWithoutExt: 'UPPERCASE.WITH.DOTS',
        ext: 'txt',
        type: 'text/plain',
        size: 37,
        lastModified: Date.now(),
        data: 'data:text/plain;base64,dGhpcyBpcyBzb21lIHBsYWluIHRleHQgZmlsZSBjb250ZW50IQ==',
      },
      {
        name: 'lowercase-file.pro5',
        nameWithoutExt: 'lowercase-file',
        ext: 'pro5',
        type: '',
        size: 19,
        lastModified: Date.now(),
        data: 'data:application/octet-stream;base64,dGhpcyBpcyBhIFBQNSBmaWxlIQ==',
      },
    ]);

    fixture.detectChanges();

    expect(component.displayInitialUi).toBeFalse();
    expect(fixture.debugElement.query(By.css('#begin-area'))).toBeNull();
    expect(fixture.debugElement.query(By.css('#drop-area-more'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('#display-area'))).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css('#display-area')).query(By.directive(SlideDisplayComponent))
    ).toBeNull();
    expect(
      fixture.debugElement
        .query(By.css('#display-area'))
        .query(By.directive(DownloadDisplayComponent))
    ).not.toBeNull();
  });

  it('should NOT call the parser when no files are passed to onFileDrop()', () => {
    spyOn(parserSvc, 'parseFiles');
    component.onFileDrop([]);
    expect(parserSvc.parseFiles).not.toHaveBeenCalled();
  });

  it('should call the parser when files are passed to onFileDrop()', () => {
    fixture.detectChanges();

    spyOn(parserSvc, 'parseFiles').and.callThrough();

    component.onFileDrop([
      {
        name: 'UPPERCASE.WITH.DOTS.TXT',
        nameWithoutExt: 'UPPERCASE.WITH.DOTS',
        ext: 'txt',
        type: 'text/plain',
        size: 37,
        lastModified: Date.now(),
        data: 'data:text/plain;base64,dGhpcyBpcyBzb21lIHBsYWluIHRleHQgZmlsZSBjb250ZW50IQ==',
      },
      {
        name: 'lowercase-file.pro5',
        nameWithoutExt: 'lowercase-file',
        ext: 'pro5',
        type: '',
        size: 19,
        lastModified: Date.now(),
        data: 'data:application/octet-stream;base64,dGhpcyBpcyBhIFBQNSBmaWxlIQ==',
      },
    ]);

    expect(parserSvc.parseFiles).toHaveBeenCalled();
  });

  it('should call onFileDrop() when files are dropped onto the begin element with the directive', (done: DoneFn) => {
    const file = new File(['this is file content!'], 'dummy.txt');
    const dt = new DataTransfer();
    dt.items.add(file);
    dt.items.add(file);

    const dropEvent = new DragEvent('drop', {
      cancelable: true,
      dataTransfer: dt,
    });

    fixture.detectChanges();
    const dropEl = fixture.debugElement.query(By.css('#begin-area .drop-area'));
    const directiveInstance = dropEl.injector.get(DragAndDropFilesDirective);

    spyOn(component, 'onFileDrop').and.callThrough();

    directiveInstance.fileDrop.subscribe(() => {
      expect(component.onFileDrop).toHaveBeenCalled();
      done();
    });

    dropEl.nativeElement.dispatchEvent(dropEvent);
    fixture.detectChanges();
  });
});
