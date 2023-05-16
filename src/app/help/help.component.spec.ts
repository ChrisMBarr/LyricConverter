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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a supported formats list of all inputs and outputs from the ParserService', () => {
    expect(component.combinedFormatsList).toEqual([
      {
        name: 'Foo',
        canImport: true,
        canExport: true,
      },
      {
        name: 'Bar',
        canImport: true,
        canExport: true,
      },
      {
        name: 'InputOnly',
        canImport: true,
        canExport: false,
      },
      {
        name: 'OutputOnly',
        canImport: false,
        canExport: true,
      },
    ]);
  });

  it('should display a table in the UI to match the supported formats list', () => {
    expect(fixture.debugElement.queryAll(By.css('table tbody tr')).length).toEqual(4);
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(1) td:nth-of-type(1)'))
        .nativeElement.textContent
    ).toEqual('✓');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(1) td:nth-of-type(2)'))
        .nativeElement.textContent
    ).toEqual('✓');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(2) td:nth-of-type(1)'))
        .nativeElement.textContent
    ).toEqual('✓');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(2) td:nth-of-type(2)'))
        .nativeElement.textContent
    ).toEqual('✓');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(3) td:nth-of-type(1)'))
        .nativeElement.textContent
    ).toEqual('✓');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(3) td:nth-of-type(2)'))
        .nativeElement.textContent
    ).toEqual('');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(4) td:nth-of-type(1)'))
        .nativeElement.textContent
    ).toEqual('');
    expect(
      fixture.debugElement.query(By.css('table tbody tr:nth-of-type(4) td:nth-of-type(2)'))
        .nativeElement.textContent
    ).toEqual('✓');
  });
});
