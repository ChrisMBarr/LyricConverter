import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';

import { ConvertComponent } from './convert.component';
import { DonateButtonComponent } from '../donate-button/donate-button.component';
import { DownloadDisplayComponent } from './download-display/download-display.component';
import { DragAndDropFilesDirective } from '../drag-and-drop-files/drag-and-drop-files.directive';
import { ErrorsService } from './errors/errors.service';
import { OutputTypeDisplaySlides } from './outputs/output-type-display-slides';
import { OutputTypePlainText } from './outputs/output-type-plain-text';
import { ParserService } from './parser/parser.service';
import { SlideDisplayComponent } from './slide-display/slide-display.component';

import { IOutputFile, IRawDataFile } from './models/file.model';
import { IOutputConverter } from './outputs/output-converter.model';
import { ISong } from './models/song.model';
import { LyricConverterError } from './models/errors.model';

import { TestUtils } from 'test/test-utils';

class MockConverter implements IOutputConverter {
  constructor(
    public name: string,
    public fileExt?: string,
  ) {}

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
  let errorsSvc: ErrorsService;

  function configureTestBed<T>(providers: Array<T>) {
    TestBed.configureTestingModule({
      declarations: [ConvertComponent, DonateButtonComponent, DragAndDropFilesDirective, SlideDisplayComponent, DownloadDisplayComponent],
      providers,
    });
    parserSvc = TestBed.inject(ParserService);
    errorsSvc = TestBed.inject(ErrorsService);

    fixture = TestBed.createComponent(ConvertComponent);
    component = fixture.componentInstance;
  }

  describe('Needs a mocked ParserService', () => {
    const mockParserService = {
      outputConverters: [] as Array<MockConverter>,
      inputConverters: [] as Array<MockConverter>,
      parsedFilesChanged$: new Subject<Array<IRawDataFile>>(),
      parseFiles: () => {},
    };

    beforeEach(() => {
      mockParserService.outputConverters = [
        new MockConverter('FooOut', 'foo'),
        new MockConverter('BarOut', 'bar'),
        new MockConverter('BazOut', 'baz'),
        new MockConverter('No File Ext'),
      ];

      mockParserService.inputConverters = [new MockConverter('FooIn', 'foo'), new MockConverter('BarIn', 'bar'), new MockConverter('BazIn', 'baz')];

      configureTestBed([{ provide: ParserService, useValue: mockParserService }, ErrorsService]);
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

        fixture.debugElement.query(By.css('#test-convert-types-nav a:nth-of-type(2)')).triggerEventHandler('click', new Event('click'));

        fixture.detectChanges();
        expect(component.selectedOutputType.name).toEqual('BarOut');
      });

      it('should save the conversion type preference when a link in the menu is clicked', () => {
        fixture.detectChanges();

        fixture.debugElement.query(By.css('#test-convert-types-nav a:nth-of-type(2)')).triggerEventHandler('click', new Event('click'));

        fixture.detectChanges();
        expect(localStorage.getItem(prefKey)).toEqual('BarOut');
      });
    });

    describe('Drop Instructions Text', () => {
      it('should list out all available input type names for accepted file formats', () => {
        fixture.detectChanges();

        expect((fixture.debugElement.query(By.css('#test-accepted-input-formats')).nativeElement as HTMLElement).textContent).toContain(
          'FooIn, BarIn, or BazIn',
        );
      });
    });
  });

  describe('Needs a real ParserService', () => {
    beforeEach(() => {
      configureTestBed([ParserService, ErrorsService]);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('User Interface', () => {
      it('should show the initial UI', () => {
        fixture.detectChanges();
        expect(component.displayInitialUi).withContext('The displayInitialUi property').toBeTrue();
        expect(fixture.debugElement.query(By.css('#begin-area')))
          .withContext('#begin-area Element')
          .not.toBeNull();
        expect(fixture.debugElement.query(By.css('#test-drop-instructions-more')))
          .withContext('#test-drop-instructions-more Element')
          .toBeNull();
        expect(fixture.debugElement.query(By.css('#display-area')))
          .withContext('#display-area Element')
          .toBeNull();
      });

      it('should show the display UI when the "display slides" output is selected after files are dropped', (done: DoneFn) => {
        fixture.detectChanges();
        component.selectedOutputType = new OutputTypeDisplaySlides();

        parserSvc.parsedFilesChanged$.subscribe(() => {
          fixture.detectChanges();

          expect(component.displayInitialUi).withContext('The displayInitialUi property').toBeFalse();
          expect(fixture.debugElement.query(By.css('#begin-area')))
            .withContext('#begin-area Element')
            .toBeNull();
          expect(fixture.debugElement.query(By.css('#test-drop-instructions-more')))
            .withContext('#test-drop-instructions-more Element')
            .not.toBeNull();
          expect(fixture.debugElement.query(By.css('#display-area')))
            .withContext('#display-area Element')
            .not.toBeNull();
          expect(fixture.debugElement.query(By.css('#display-area')).query(By.directive(SlideDisplayComponent)))
            .withContext('The SlideDisplayComponent inside of the #display-area Element')
            .not.toBeNull();
          expect(fixture.debugElement.query(By.css('#display-area')).query(By.directive(DownloadDisplayComponent)))
            .withContext('The DownloadDisplayComponent inside of the #display-area Element')
            .toBeNull();

          done();
        });

        const file = new File(['this is file content!'], 'dummy.txt');
        const dt = new DataTransfer();
        dt.items.add(file);
        dt.items.add(file);

        component.onReceiveFiles(dt.files);
      });

      it('should show the download UI when anything but the "display slides" output is selected after files are dropped', (done: DoneFn) => {
        fixture.detectChanges();
        component.selectedOutputType = new OutputTypePlainText();

        parserSvc.parsedFilesChanged$.subscribe(() => {
          fixture.detectChanges();
          expect(component.displayInitialUi).withContext('The displayInitialUi property').toBeFalse();
          expect(fixture.debugElement.query(By.css('#begin-area')))
            .withContext('#begin-area Element')
            .toBeNull();
          expect(fixture.debugElement.query(By.css('#test-drop-instructions-more')))
            .withContext('#test-drop-instructions-more Element')
            .not.toBeNull();
          expect(fixture.debugElement.query(By.css('#display-area')))
            .withContext('#display-area Element')
            .not.toBeNull();
          expect(fixture.debugElement.query(By.css('#display-area')).query(By.directive(SlideDisplayComponent)))
            .withContext('The SlideDisplayComponent inside of the #display-area Element')
            .toBeNull();
          expect(fixture.debugElement.query(By.css('#display-area')).query(By.directive(DownloadDisplayComponent)))
            .withContext('The DownloadDisplayComponent inside of the #display-area Element')
            .not.toBeNull();

          done();
        });

        const file = new File(['this is file content!'], 'dummy.txt');
        const dt = new DataTransfer();
        dt.items.add(file);
        dt.items.add(file);

        component.onReceiveFiles(dt.files);
      });
    });

    describe('Drop area interaction, file chooser interaction, and onReceiveFiles()', () => {
      it('should NOT call the parser when no files are passed to onReceiveFiles()', () => {
        spyOn(parserSvc, 'parseFiles');
        const dt = new DataTransfer();

        component.onReceiveFiles(dt.files);
        expect(parserSvc.parseFiles).not.toHaveBeenCalled();
      });

      it('should call the parser when files are passed to onReceiveFiles()', () => {
        spyOn(parserSvc, 'parseFiles').and.callFake(() => []);

        fixture.detectChanges();

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

        component.onReceiveFiles(dt.files);
        expect(parserSvc.parseFiles).toHaveBeenCalled();
      });

      it('should call onReceiveFiles() when files are dropped onto the begin element with the directive', (done: DoneFn) => {
        fixture.detectChanges();
        spyOn(component, 'onReceiveFiles').and.callThrough();

        const file = new File(['this is file content!'], 'dummy.txt');
        const dt = new DataTransfer();
        dt.items.add(file);
        dt.items.add(file);

        const dropEvent = new DragEvent('drop', {
          cancelable: true,
          dataTransfer: dt,
        });

        const dropEl = fixture.debugElement.query(By.css('#drop-area'));
        const directiveInstance = dropEl.injector.get(DragAndDropFilesDirective);

        directiveInstance.fileDrop.subscribe(() => {
          expect(component.onReceiveFiles).toHaveBeenCalled();
          done();
        });

        directiveInstance.document.dispatchEvent(dropEvent);
        fixture.detectChanges();
      });

      it('should call onReceiveFiles() when files manually selected with the file input', () => {
        spyOn(component, 'onReceiveFiles').and.callThrough();
        fixture.detectChanges();

        const file = new File(['this is file content!'], 'dummy.txt');
        const dt = new DataTransfer();
        dt.items.add(file);
        dt.items.add(file);

        const inputElDebug = fixture.debugElement.query(By.css('input[type="file"]'));
        const inputEl = inputElDebug.nativeElement as HTMLInputElement;
        inputEl.files = dt.files;

        const changeEvent = new Event('change');
        inputEl.dispatchEvent(changeEvent);

        fixture.detectChanges();

        expect(component.onReceiveFiles).toHaveBeenCalledWith(dt.files);
      });

      it('should trigger a click event on the file chooser when the "select some files" link is clicked', () => {
        fixture.detectChanges();

        const inputEl = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement as HTMLInputElement;

        spyOn(inputEl, 'click').and.callFake(() => {});

        const selectFilesLinkEl = fixture.debugElement.query(By.css('#begin-area a')).nativeElement as HTMLAnchorElement;
        const clickEvent = new Event('click');
        selectFilesLinkEl.dispatchEvent(clickEvent);
        fixture.detectChanges();
        expect(inputEl.click).withContext('The "select some files" link that triggers the file input').toHaveBeenCalledTimes(1);
      });

      it('should trigger a click event on the file chooser when the "select some more files" link is clicked', () => {
        component.displayInitialUi = false;
        fixture.detectChanges();

        const inputEl = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement as HTMLInputElement;

        spyOn(inputEl, 'click').and.callFake(() => {});

        const selectFilesLinkEl = fixture.debugElement.query(By.css('#test-drop-instructions-more a')).nativeElement as HTMLAnchorElement;
        const clickEvent = new Event('click');
        selectFilesLinkEl.dispatchEvent(clickEvent);
        fixture.detectChanges();
        expect(inputEl.click).withContext('The "select some more files" link that triggers the file input').toHaveBeenCalledTimes(1);
      });
    });

    describe('getConvertersAndExtractData()', () => {
      const rawJsonFile: IRawDataFile = {
        dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
        dataAsString:
          '{\r\n    "title": "Great is your faithfulness O God",\r\n    "info": [{\r\n        "name": "Order",\r\n        "value": "1C2CBC"\r\n    }],\r\n    "slides": [{\r\n        "title": "Chorus",\r\n        "lyrics": "Your grace is enough\\r\\nYour grace is enough\\r\\nYour grace is enough for me"\r\n    }, {\r\n        "title": "Verse 1",\r\n        "lyrics": "Great is your faithfulness O God\\r\\nYou wrestle with the sinners heart\\r\\nYou lead us by still waters and to mercy\\r\\nAnd nothing can keep us apart"\r\n    }, {\r\n        "title": "Verse 2",\r\n        "lyrics": "Great is your love and justice God\\r\\nYou use the weak to lead the strong\\r\\nYou lead us in the song of your salvation\\r\\nAnd all your people sing along"\r\n    }, {\r\n        "title": "Verse 3",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Verse 4",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Verse 5",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Verse 6",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Verse 7",\r\n        "lyrics": ""\r\n    }, {\r\n        "title": "Coda",\r\n        "lyrics": "(Chorus 2.)\\r\\n\\r\\nYour grace is enough\\r\\nHeaven reaching down to us\\r\\nYour grace is enough for me\\r\\nGod, I see your grace is enough\\r\\nI\'m covered in your love\\r\\nYour grace is enough for me\\r\\nFor me"\r\n    }, {\r\n        "title": "Bridge",\r\n        "lyrics": "So remember you people\\r\\nRemember your children\\r\\nRemember your promise\\r\\nOh God"\r\n    }]\r\n}',
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
              lyrics: 'So remember you people\r\nRemember your children\r\nRemember your promise\r\nOh God',
            },
          ],
        },
        fileName: 'JSON - Your Grace Is Enough.txt',
        outputContent:
          "Title: Great is your faithfulness O God\nOrder: 1C2CBC\n\n\nChorus:\nYour grace is enough\r\nYour grace is enough\r\nYour grace is enough for me\n\nVerse 1:\nGreat is your faithfulness O God\r\nYou wrestle with the sinners heart\r\nYou lead us by still waters and to mercy\r\nAnd nothing can keep us apart\n\nVerse 2:\nGreat is your love and justice God\r\nYou use the weak to lead the strong\r\nYou lead us in the song of your salvation\r\nAnd all your people sing along\n\nCoda:\n(Chorus 2.)\r\n\r\nYour grace is enough\r\nHeaven reaching down to us\r\nYour grace is enough for me\r\nGod, I see your grace is enough\r\nI'm covered in your love\r\nYour grace is enough for me\r\nFor me\n\nBridge:\nSo remember you people\r\nRemember your children\r\nRemember your promise\r\nOh God",
      };

      it('should get converters for passed in raw files and list them for Text Type Output', () => {
        component.selectedOutputType = new OutputTypePlainText();
        component.getConvertersAndExtractData([rawJsonFile]);
        expect(component.convertedSongsForOutput).toEqual([outputFile]);
      });

      it('should NOT get converters for passed in raw files of an unknown type', async () => {
        const imageFile = await TestUtils.loadTestFileAsRawDataFile('image', 'mr-bean.png');

        component.selectedOutputType = new OutputTypePlainText();
        component.getConvertersAndExtractData([rawJsonFile, imageFile]);
        expect(component.convertedSongsForOutput).toEqual([outputFile]);
      });
    });

    describe('File Conversion Count Tracking & Donation Nag', () => {
      const prefKey = 'CONVERT_COUNT';

      beforeEach(() => {
        localStorage.clear();
      });

      afterEach(() => {
        localStorage.clear();
      });

      it('should increase the count when a song of a known type is converted', () => {
        fixture.detectChanges();
        expect(component.convertedFileCount).toEqual(0);

        const fakeParsedFiles: Array<IRawDataFile> = [
          {
            dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
            dataAsString: '{"title": "Great is your faithfulness O God","info": [], "slides": []}',
            ext: 'json',
            name: 'JSON - Your Grace Is Enough',
            type: 'application/json',
          },
        ];
        component.getConvertersAndExtractData(fakeParsedFiles);
        fixture.detectChanges();
        expect(component.convertedFileCount).toEqual(1);
      });

      it('should NOT increase the count when a song of an unknown type is converted', () => {
        fixture.detectChanges();
        expect(component.convertedFileCount).toEqual(0);

        const fakeParsedFiles: Array<IRawDataFile> = [
          {
            dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
            dataAsString: 'blah blah whatever',
            ext: 'notreal',
            name: 'fake file',
            type: 'application/madeup',
          },
        ];
        component.getConvertersAndExtractData(fakeParsedFiles);
        fixture.detectChanges();
        expect(component.convertedFileCount).toEqual(0);
      });

      it('should update the saved value in localStorage when converting a song', () => {
        fixture.detectChanges();

        const fakeParsedFiles: Array<IRawDataFile> = [
          {
            dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
            dataAsString: '{"title": "Great is your faithfulness O God","info": [], "slides": []}',
            ext: 'json',
            name: 'JSON - Your Grace Is Enough',
            type: 'application/json',
          },
        ];
        component.getConvertersAndExtractData(fakeParsedFiles);
        fixture.detectChanges();
        expect(localStorage.getItem(prefKey)).toEqual('1');
      });

      it('start the count at a previously saved value from localStorage', () => {
        localStorage.setItem(prefKey, '5');
        fixture.detectChanges();
        expect(component.convertedFileCount).toEqual(5);
      });

      it('should NOT display the donation nag UI when the total converted amount is less than the threshold', () => {
        component.convertedFileCount = component.convertedCountMessageThreshold - 1;
        component.displayInitialUi = false;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#test-donate'))).toBeNull();
      });

      it('should display the donation nag UI when the total converted amount equals the threshold', () => {
        component.convertedFileCount = component.convertedCountMessageThreshold;
        component.displayInitialUi = false;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#test-donate'))).not.toBeNull();
      });
    });

    describe('Errors', () => {
      it('should add an error to the ErrorsService when an unknown file type fails to match with an InputConverter', () => {
        fixture.detectChanges();
        spyOn(errorsSvc, 'add').and.callThrough();

        //Once with a regular file name that has an extension
        component.getConvertersAndExtractData([
          {
            name: 'cat',
            ext: 'jpg',
            type: 'image/jpeg',
            dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
            dataAsString: 'pretend this is image data',
          },
        ]);

        expect(errorsSvc.add).toHaveBeenCalledWith({
          message: `This is not a file type that LyricConverter knows how to convert!`,
          fileName: 'cat.jpg',
        });

        //Again with a file name that does not have an extension
        component.getConvertersAndExtractData([
          {
            name: 'no-extension',
            ext: '',
            type: '',
            dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
            dataAsString: 'junk data here',
          },
        ]);

        expect(errorsSvc.add).toHaveBeenCalledWith({
          message: `This is not a file type that LyricConverter knows how to convert!`,
          fileName: 'no-extension',
        });
      });

      it('should call the ErrorService when an InputConverter downstream throws a custom error for a known error case', () => {
        fixture.detectChanges();
        spyOn(errorsSvc, 'add').and.callThrough();

        component.getConvertersAndExtractData([
          {
            name: 'bad-file',
            ext: 'json',
            type: 'text/json',
            dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
            dataAsString: '{}',
          },
        ]);

        const expectedErr = new LyricConverterError('This file is not formatted as a LyricConverter JSON file');
        expect(errorsSvc.add).toHaveBeenCalledWith({
          message: expectedErr.message,
          fileName: 'bad-file.json',
          thrownError: expectedErr,
        });
      });

      it("should call the ErrorService when an InputConverter downstream throws a native error for something we can't control", () => {
        fixture.detectChanges();
        spyOn(errorsSvc, 'add').and.callThrough();

        component.getConvertersAndExtractData([
          {
            name: 'malformed-file',
            ext: 'json',
            type: 'text/json',
            dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
            dataAsString: '{{{{{',
          },
        ]);

        //We can't test against specific error messages thrown due to error message text differences in how browsers report them
        expect(errorsSvc.add).toHaveBeenCalled();
      });

      it("should call the ErrorService when an OutputConverter downstream throws a native error for something we can't control", () => {
        fixture.detectChanges();
        spyOn(errorsSvc, 'add').and.callThrough();

        component.selectedOutputType = {
          name: 'Mock Output File Type',
          fileExt: 'fake',
          convertToType(song): IOutputFile {
            throw SyntaxError();

            //@ts-expect-error - we are testing throwing errors so we need this unreachable code
            return {
              fileName: `${song.fileName}.${this.fileExt!}`,
              outputContent: '',
              songData: song,
            };
          },
        };

        const fakeParsedFiles: Array<IRawDataFile> = [
          {
            dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
            dataAsString: '{"title": "Great is your faithfulness O God","info": [], "slides": []}',
            ext: 'json',
            name: 'Your Grace Is Enough',
            type: 'application/json',
          },
        ];

        component.getConvertersAndExtractData(fakeParsedFiles);

        //We can't test against specific error messages thrown due to error message text differences in how browsers report them
        expect(errorsSvc.add).toHaveBeenCalled();
      });

      it('should update the local errorList property from the subscription when a new error is added', (done: DoneFn) => {
        fixture.detectChanges();

        errorsSvc.errorsChanged$.subscribe((errorsList) => {
          expect(component.errorsList).toEqual(errorsList);
          done();
        });

        errorsSvc.add({
          message: '[[TEST:convert.component.spec.ts]] test message',
        });
      });

      it('should tell the ErrorsService to clear out error messages when receiving new files to parse', () => {
        spyOn(errorsSvc, 'clear');

        const dt = new DataTransfer();
        dt.items.add(new File(['foo'], 'foo.txt'));
        component.onReceiveFiles(dt.files);

        expect(errorsSvc.clear).toHaveBeenCalled();
      });

      it('should NOT show the errors list in the UI when there are no errors', () => {
        component.displayInitialUi = false;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#test-error-message-display')))
          .withContext('The #test-error-message-display Element')
          .toBeNull();
      });

      it('should display the errors in the UI properly when there are errors', () => {
        component.displayInitialUi = false;
        component.errorsList = [
          { message: '[[TEST:convert.component.spec.ts]] Just a message' },
          {
            message: '[[TEST:convert.component.spec.ts]] A message with a file name',
            fileName: 'not-a-virus.exe',
          },
        ];
        fixture.detectChanges();

        const errorListEl = fixture.debugElement.query(By.css('#test-error-message-display'));
        expect(errorListEl).withContext('The #test-error-message-display Element').not.toBeNull();

        expect(errorListEl.queryAll(By.css('ul li')).length)
          .withContext('The count of displayed error messages')
          .toEqual(2);
        expect((errorListEl.query(By.css('ul li:nth-of-type(1)')).nativeElement as HTMLElement).innerText.trim())
          .withContext('The 1st error message in the list')
          .toEqual('[[TEST:convert.component.spec.ts]] Just a message');
        expect((errorListEl.query(By.css('ul li:nth-of-type(2)')).nativeElement as HTMLElement).innerText.trim())
          .withContext('The 2nd error message in the list')
          .toEqual('not-a-virus.exe - [[TEST:convert.component.spec.ts]] A message with a file name');
      });
    });
  });
});
