import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ConvertComponent } from './convert.component';
import { DonateButtonComponent } from '../donate-button/donate-button.component';
import { ParserService } from './parser/parser.service';
import { DragAndDropFilesDirective } from '../drag-and-drop-files/drag-and-drop-files.directive';

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

    xit('should build a list of all available output types to convert to', () => {
      fixture.detectChanges();

      expect(component.outputTypesForMenu).toEqual([
        { name: 'Pro Presenter', ext: 'pro*' },
        { name: 'Lyric Converter', ext: 'json' },
        { name: 'Plain Text', ext: 'txt' },
        { name: 'Display Slides' }, //this is always added as the last item
      ]);
    });

    xit('should auto-select the first type to convert to when no preference is saved', () => {
      fixture.detectChanges();
      expect(component.selectedConversionType).toEqual('Pro Presenter');
    });

    it('should auto-select the saved type to convert to when a preference is saved', () => {
      localStorage.setItem(prefKey, 'Custom Pref');
      fixture.detectChanges();
      console.log('pref',localStorage.getItem(prefKey), component.selectedConversionType)
      expect(component.selectedConversionType).toEqual('Custom Pref');
    });

    it('should change the conversion type when switchConversionType() is called', () => {
      fixture.detectChanges();
      component.onSwitchConversionType('FooBar');
      fixture.detectChanges();
      expect(component.selectedConversionType).toEqual('FooBar');
    });

    xit('should change the conversion type when a link in the menu is clicked', () => {
      fixture.detectChanges();

      fixture.debugElement
        .query(By.css('#convert-types .list-group-item:nth-of-type(2)'))
        .triggerEventHandler('click');

      fixture.detectChanges();
      expect(component.selectedConversionType).toEqual('Lyric Converter');
    });

    xit('should save the conversion type preference when a link in the menu is clicked', () => {
      fixture.detectChanges();

      fixture.debugElement
        .query(By.css('#convert-types .list-group-item:nth-of-type(2)'))
        .triggerEventHandler('click');

      fixture.detectChanges();
      expect(localStorage.getItem(prefKey)).toEqual('Lyric Converter');
    });
  });

  it('should NOT call the parser when no files are passed to onFileDrop()', () => {
    spyOn(parserSvc, 'parseFiles');
    component.onFileDrop([]);
    expect(parserSvc.parseFiles).not.toHaveBeenCalled();
  });

  it('should call the parser when files are passed to onFileDrop()', () => {
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
