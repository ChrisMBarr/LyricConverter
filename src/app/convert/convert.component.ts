import { Component, OnInit } from '@angular/core';
import { ParserService } from './parser/parser.service';
import { IFileWithData } from '../shared/file.model';
import { FormatterService } from './formatters/formatter.service';
import { IFormat } from './formatters/format.model';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})
export class ConvertComponent implements OnInit {

  formatsForMenu: {name: string, ext?: string}[] = [];
  selectedConversionType: string = '';

  constructor(
    private parserSvc: ParserService,
    private formatterSvc: FormatterService
  ) {}

  ngOnInit(): void {
    this.formatsForMenu = [...this.formatterSvc.formatters].map((fmt: IFormat)=>{
      return {
        name: fmt.friendlyName,
        ext: fmt.friendlyFileExt
      }
    });
    this.formatsForMenu.push({
      name:'Display Slides'
    })

    //auto-select the first type
    this.selectedConversionType = this.formatsForMenu[0].name;
  }

  switchConversionType(newType: string): void{
    this.selectedConversionType = newType;
  }

  onFileDrop(files: IFileWithData[]): void {
    if (files && files.length) {
      this.parserSvc.parseFiles(files);
    }
  }
}
