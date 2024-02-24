import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { ParserService } from '../convert/parser/parser.service';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let parserSvc: ParserService;

  //this is how Angular defines it!
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  function configureTestBed(providersArray: Array<any>) {
    TestBed.configureTestingModule({
      declarations: [HelpComponent],
      providers: providersArray,
    });
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    parserSvc = TestBed.inject(ParserService);
  }

  it('should create', () => {
    configureTestBed([ParserService]);
    expect(component).toBeTruthy();
  });

  it('should build an alphabetized list of supported formats from the ParserService, and unsupported formats local to the component', () => {
    const mockParserService = {
      inputConverters: [
        { name: 'Foo', url: undefined },
        { name: 'Bar', url: 'http://google.com' },
        { name: 'InputOnly', url: 'http://yahoo.com' },
      ],
      outputConverters: [
        { name: 'Foo', url: undefined },
        { name: 'Bar', url: 'http://google.com' },
        { name: 'OutputOnly', url: 'http://bing.com' },
      ],
    };
    configureTestBed([{ provide: ParserService, useValue: mockParserService }]);

    component.unsupportedFormatsList = [
      {
        name: 'Not Supported',
        canImport: false,
        canExport: false,
        hasNote: false,
        url: 'http://askjeeves.com',
      },
    ];
    fixture.detectChanges();

    expect(component.combinedFormatsList).toEqual([
      { name: 'Bar', canImport: true, canExport: true, hasNote: false, url: 'http://google.com' },
      { name: 'Foo', canImport: true, canExport: true, hasNote: false, url: undefined },
      {
        name: 'InputOnly',
        canImport: true,
        canExport: false,
        hasNote: false,
        url: 'http://yahoo.com',
      },
      {
        name: 'Not Supported',
        canImport: false,
        canExport: false,
        hasNote: false,
        url: 'http://askjeeves.com',
      },
      {
        name: 'OutputOnly',
        canImport: false,
        canExport: true,
        hasNote: false,
        url: 'http://bing.com',
      },
    ]);
  });

  it('Should not have an item in the unsupported list that is actually supported', () => {
    configureTestBed([ParserService]);
    fixture.detectChanges();

    const unsupportedNames = component.unsupportedFormatsList.map((f) => f.name);
    const inputFormatNames = parserSvc.inputConverters.map((f) => f.name);
    const outputFormatNames = parserSvc.outputConverters.map((f) => f.name);

    unsupportedNames.forEach((n) => {
      expect(inputFormatNames)
        .withContext('A supported input format name was found in the list of unsupported formats! Remove this!')
        .not.toContain(n);
      expect(outputFormatNames)
        .withContext('A supported output format name was found in the list of unsupported formats! Remove this!')
        .not.toContain(n);
    });
  });
});
