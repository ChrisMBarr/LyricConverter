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
import { IOutputConverter } from './outputs/output-converter.model';
import { IOutputFile, IRawDataFile } from './models/file.model';
import { ISong } from './models/song.model';
import * as mockRawFiles from '../../../test/mock-raw-files';

class mockOutputConverter implements IOutputConverter {
  constructor(public name: string, public fileExt?: string) {}

  convertToType = (song: ISong): IOutputFile => {
    return {
      songData: song,
      fileName: '',
      outputContent: '',
    };
  };
}

describe('ConvertComponent', () => {
  let component: ConvertComponent;
  let fixture: ComponentFixture<ConvertComponent>;
  let parserSvc: ParserService;

  function configureTestBed<T>(providers: T[]) {
    TestBed.configureTestingModule({
      declarations: [
        ConvertComponent,
        DonateButtonComponent,
        DragAndDropFilesDirective,
        SlideDisplayComponent,
        DownloadDisplayComponent,
      ],
      providers: <T[]>providers,
    });
    parserSvc = TestBed.inject(ParserService);

    fixture = TestBed.createComponent(ConvertComponent);
    component = fixture.componentInstance;
  }

  describe('Needs a mocked ParserService', () => {
    const mockParserService = {
      outputConverters: <mockOutputConverter[]>[],
      parseFiles: () => <IRawDataFile[]>[],
    };

    beforeEach(() => {
      mockParserService.outputConverters = [
        new mockOutputConverter('FooOut', 'foo'),
        new mockOutputConverter('BarOut', 'bar'),
        new mockOutputConverter('BazOut', 'baz'),
        new mockOutputConverter('No File Ext'),
      ];

      configureTestBed([{ provide: ParserService, useValue: mockParserService }]);
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
        expect(component.outputTypesForMenu).toEqual(mockParserService.outputConverters);
      });

      it('should auto-select the first type to convert to when no preference is saved', () => {
        fixture.detectChanges();
        expect(component.selectedOutputType.name).toEqual('FooOut');
      });

      it('should auto-select the saved type to convert to when a preference is saved', () => {
        localStorage.setItem(prefKey, 'BazOut');
        fixture.detectChanges();
        expect(component.selectedOutputType.name).toEqual('BazOut');
      });

      it('should change the conversion type when switchConversionType() is called', () => {
        fixture.detectChanges();
        component.onSwitchConversionType(mockParserService.outputConverters[3]!, new Event('click'));
        fixture.detectChanges();
        expect(component.selectedOutputType.name).toEqual('No File Ext');
      });

      it('should change the conversion type when a link in the menu is clicked', () => {
        fixture.detectChanges();

        fixture.debugElement
          .query(By.css('#convert-types .list-group-item:nth-of-type(2)'))
          .triggerEventHandler('click', new Event('click'));

        fixture.detectChanges();
        expect(component.selectedOutputType.name).toEqual('BarOut');
      });

      it('should save the conversion type preference when a link in the menu is clicked', () => {
        fixture.detectChanges();

        fixture.debugElement
          .query(By.css('#convert-types .list-group-item:nth-of-type(2)'))
          .triggerEventHandler('click', new Event('click'));

        fixture.detectChanges();
        expect(localStorage.getItem(prefKey)).toEqual('BarOut');
      });
    });
  });

  describe('Needs a real ParserService', () => {
    beforeEach(() => {
      configureTestBed([ParserService]);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('Drop area UI', () => {
      it('should show the initial UI', () => {
        fixture.detectChanges();
        expect(component.displayInitialUi).toBeTrue();
        expect(fixture.debugElement.query(By.css('#begin-area'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('#drop-area-more'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#display-area'))).toBeNull();
      });

      it('should show the display UI when the "display slides" output is selected after files are dropped', () => {
        spyOn(component, 'getConvertersAndExtractData').and.callFake(() => []);

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
          fixture.debugElement
            .query(By.css('#display-area'))
            .query(By.directive(SlideDisplayComponent))
        ).not.toBeNull();
        expect(
          fixture.debugElement
            .query(By.css('#display-area'))
            .query(By.directive(DownloadDisplayComponent))
        ).toBeNull();
      });

      it('should show the download UI when anything but the "display slides" output is selected after files are dropped', () => {
        spyOn(component, 'getConvertersAndExtractData').and.callFake(() => []);

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
          fixture.debugElement
            .query(By.css('#display-area'))
            .query(By.directive(SlideDisplayComponent))
        ).toBeNull();
        expect(
          fixture.debugElement
            .query(By.css('#display-area'))
            .query(By.directive(DownloadDisplayComponent))
        ).not.toBeNull();
      });
    });

    describe('Drop area interaction & fileDrop()', () => {
      it('should NOT call the parser when no files are passed to onFileDrop()', () => {
        spyOn(parserSvc, 'parseFiles');
        component.onFileDrop([]);
        expect(parserSvc.parseFiles).not.toHaveBeenCalled();
      });

      it('should call the parser when files are passed to onFileDrop()', () => {
        fixture.detectChanges();

        spyOn(parserSvc, 'parseFiles').and.callFake(() => []);

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

    describe('getConvertersAndExtractData()', () => {
      const rawJsonFile: IRawDataFile = {
        data: '{\r\n    "title": "Great is your faithfulness O God",\r\n    "info": [{\r\n        "name": "Order",\r\n        "value": "1C2CBC"\r\n    }],\r\n    "slides": [{\r\n        "title": "Chorus",\r\n        "lyrics": "Your grace is enough\\r\\nYour grace is enough\\r\\nYour grace is enough for me"\r\n    }, {\r\n        "title": "Verse 1",\r\n        "lyrics": "Great is your faithfulness O God\\r\\nYou wrestle with the sinners heart\\r\\nYou lead us by still waters and to mercy\\r\\nAnd nothing can keep us apart"\r\n    }, {\r\n        "title": "Verse 2",\r\n        "lyrics": "Great is your love and justice God\\r\\nYou use the weak to lead the strong\\r\\nYou lead us in the song of your salvation\\r\\nAnd all your people sing along"\r\n    }, {\r\n        "title": "Verse 3",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Verse 4",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Verse 5",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Verse 6",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Verse 7",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Coda",\r\n        "lyrics": "(Chorus 2.)\\r\\n\\r\\nYour grace is enough\\r\\nHeaven reaching down to us\\r\\nYour grace is enough for me\\r\\nGod, I see your grace is enough\\r\\nI\'m covered in your love\\r\\nYour grace is enough for me\\r\\nFor me"\r\n    }, {\r\n        "title": "Bridge",\r\n        "lyrics": "So remember you people\\r\\nRemember your children\\r\\nRemember your promise\\r\\nOh God"\r\n    }]\r\n}',
        ext: 'json',
        name: 'JSON - Your Grace Is Enough',
        type: 'application/json',
      };

      const outputFile: IOutputFile = {
        songData: {
          fileName: 'JSON - Your Grace Is Enough',
          title: 'Great is your faithfulness O God',
          info: [{ name: 'Order', value: '1C2CBC' }],
          slides: [
            {
              title: 'Chorus',
              lyrics: 'Your grace is enough\r\nYour grace is enough\r\nYour grace is enough for me',
            },
            {
              title: 'Verse 1',
              lyrics:
                'Great is your faithfulness O God\r\nYou wrestle with the sinners heart\r\nYou lead us by still waters and to mercy\r\nAnd nothing can keep us apart',
            },
            {
              title: 'Verse 2',
              lyrics:
                'Great is your love and justice God\r\nYou use the weak to lead the strong\r\nYou lead us in the song of your salvation\r\nAnd all your people sing along',
            },
            { title: 'Verse 3', lyrics: '' },
            { title: 'Verse 4', lyrics: '' },
            { title: 'Verse 5', lyrics: '' },
            { title: 'Verse 6', lyrics: '' },
            { title: 'Verse 7', lyrics: '' },
            {
              title: 'Coda',
              lyrics:
                "(Chorus 2.)\r\n\r\nYour grace is enough\r\nHeaven reaching down to us\r\nYour grace is enough for me\r\nGod, I see your grace is enough\r\nI'm covered in your love\r\nYour grace is enough for me\r\nFor me",
            },
            {
              title: 'Bridge',
              lyrics:
                'So remember you people\r\nRemember your children\r\nRemember your promise\r\nOh God',
            },
          ],
        },
        fileName: 'JSON - Your Grace Is Enough.txt',
        outputContent:
          "Title: Great is your faithfulness O God\nOrder: 1C2CBC\n\nChorus\nYour grace is enough\r\nYour grace is enough\r\nYour grace is enough for me\n\nVerse 1\nGreat is your faithfulness O God\r\nYou wrestle with the sinners heart\r\nYou lead us by still waters and to mercy\r\nAnd nothing can keep us apart\n\nVerse 2\nGreat is your love and justice God\r\nYou use the weak to lead the strong\r\nYou lead us in the song of your salvation\r\nAnd all your people sing along\n\nCoda\n(Chorus 2.)\r\n\r\nYour grace is enough\r\nHeaven reaching down to us\r\nYour grace is enough for me\r\nGod, I see your grace is enough\r\nI'm covered in your love\r\nYour grace is enough for me\r\nFor me\n\nBridge\nSo remember you people\r\nRemember your children\r\nRemember your promise\r\nOh God",
      };

      it('should get converters for passed in raw files and list them for Text Type Output', () => {
        component.selectedOutputType = new OutputTypeText();
        component.getConvertersAndExtractData([rawJsonFile]);
        expect(component.convertedSongsForOutput).toEqual([outputFile]);
      });

      it('should NOT get converters for passed in raw files of an unknown type', () => {
        component.selectedOutputType = new OutputTypeText();
        component.getConvertersAndExtractData([rawJsonFile, mockRawFiles.mockImageFile]);
        expect(component.convertedSongsForOutput).toEqual([outputFile]);
      });
    });
  });
});
