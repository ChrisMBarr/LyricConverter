import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ConvertComponent } from './convert.component';
import { DonateButtonComponent } from '../donate-button/donate-button.component';
import { ParserService } from './parser/parser.service';
import { DragAndDropFilesDirective } from '../drag-and-drop-files/drag-and-drop-files.directive';
import { FormatterService } from './formatters/formatter.service';

describe('ConvertComponent', () => {
  let component: ConvertComponent;
  let fixture: ComponentFixture<ConvertComponent>;
  let parserSvc: ParserService;

  beforeEach(() => {
    const mockFormatterService = {
      formatters: [
        { friendlyName: 'First Item', friendlyFileExt: 'one' },
        { friendlyName: 'Second Item', friendlyFileExt: 'two' },
        { friendlyName: 'Third Item', friendlyFileExt: 'three' },
      ],
    };

    TestBed.configureTestingModule({
      declarations: [
        ConvertComponent,
        DonateButtonComponent,
        DragAndDropFilesDirective,
      ],
      providers: [
        { provide: FormatterService, useValue: mockFormatterService },
      ],
    });
    parserSvc = TestBed.inject(ParserService);

    fixture = TestBed.createComponent(ConvertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a list of all available types to convert to', () => {
    expect(component.formatsForMenu).toEqual([
      { name: 'First Item', ext: 'one' },
      { name: 'Second Item', ext: 'two' },
      { name: 'Third Item', ext: 'three' },
      { name: 'Display Slides' }, //this is always added as the last item
    ]);
  });

  it('should auto-select the first type to convert to', () => {
    expect(component.selectedConversionType).toEqual('First Item');
  });

  it('should change the conversion type when switchConversionType() is called', () => {
    component.switchConversionType('FooBar');
    expect(component.selectedConversionType).toEqual('FooBar');
  });

  it('should change the conversion type when a link in the menu is clicked', () => {
    const x = fixture.debugElement
      .query(By.css('#convert-types .list-group-item:nth-of-type(2)'))
      .triggerEventHandler('click');

      fixture.detectChanges();
    expect(component.selectedConversionType).toEqual('Second Item');
  });

  it('should NOT call the parser when no files are passed to onFileDrop()', () => {
    spyOn(parserSvc, 'parseFiles');
    component.onFileDrop([]);
    expect(parserSvc.parseFiles).not.toHaveBeenCalled();
  });

  it('should call the parser when files are passed to onFileDrop()', () => {
    spyOn(parserSvc, 'parseFiles');

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

  it('should call onFileDrop() when files are dropped onto the element with the directive', (done: DoneFn) => {
    const file = new File(['this is file content!'], 'dummy.txt');
    const dt = new DataTransfer();
    dt.items.add(file);
    dt.items.add(file);

    const dropEvent = new DragEvent('drop', {
      cancelable: true,
      dataTransfer: dt,
    });

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
