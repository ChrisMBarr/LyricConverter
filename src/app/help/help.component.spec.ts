import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpComponent } from './help.component';
import { ParserService } from '../convert/parser/parser.service';
import { By } from '@angular/platform-browser';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  const mockParserService = {
    inputConverters: [{ name: 'Foo' }, { name: 'Bar' }, { name: 'InputOnly' }],
    outputConverters: [{ name: 'Foo' }, { name: 'Bar' }, { name: 'OutputOnly' }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelpComponent],
      providers: [{ provide: ParserService, useValue: mockParserService }],
    });
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;

    component.unsupportedFormatsList = [
      { name: 'Not Supported', canImport: false, canExport: false },
    ];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build an alphabetized list of supported formats from the ParserService, and unsupported formats local to the component', () => {
    expect(component.combinedFormatsList).toEqual([
      { name: 'Bar', canImport: true, canExport: true },
      { name: 'Foo', canImport: true, canExport: true },
      { name: 'InputOnly', canImport: true, canExport: false },
      { name: 'Not Supported', canImport: false, canExport: false },
      { name: 'OutputOnly', canImport: false, canExport: true },
    ]);
  });

  it('should display a table in the UI to match the supported formats list', () => {

    expect(fixture.debugElement.queryAll(By.css('table tbody tr')).length)
      .withContext('Number of table rows')
      .toEqual(5);
    //---------------------------------
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(1) td:nth-of-type(1)'))
        .nativeElement.textContent
    )
      .withContext('Row 1, cell 1')
      .toEqual('✓');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(1) td:nth-of-type(2)'))
        .nativeElement.textContent
    )
      .withContext('Row 1, cell 2')
      .toEqual('✓');
    //---------------------------------
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(2) td:nth-of-type(1)'))
        .nativeElement.textContent
    )
      .withContext('Row 2, cell 1')
      .toEqual('✓');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(2) td:nth-of-type(2)'))
        .nativeElement.textContent
    )
      .withContext('Row 2, cell 2')
      .toEqual('✓');
    //---------------------------------
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(3) td:nth-of-type(1)'))
        .nativeElement.textContent
    )
      .withContext('Row 3, cell 1')
      .toEqual('✓');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(3) td:nth-of-type(2)'))
        .nativeElement.textContent
    )
      .withContext('Row 3, cell 2')
      .toEqual('');
    //---------------------------------
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(4) td:nth-of-type(1)'))
        .nativeElement.textContent
    )
      .withContext('Row 4, cell 1')
      .toEqual('');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(4) td:nth-of-type(2)'))
        .nativeElement.textContent
    )
      .withContext('Row 4, cell 2')
      .toEqual('');
    //---------------------------------
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(5) td:nth-of-type(1)'))
        .nativeElement.textContent
    )
      .withContext('Row 5, cell 1')
      .toEqual('');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(5) td:nth-of-type(2)'))
        .nativeElement.textContent
    )
      .withContext('Row 5, cell 2')
      .toEqual('✓');
  });
});
