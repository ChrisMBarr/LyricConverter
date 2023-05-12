import { Component } from '@angular/core';
import { ParserService } from './parser/parser.service';
import { IFileWithData } from '../shared/file.model';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})
export class ConvertComponent {

  constructor(private parser: ParserService){}

  onFileDrop(files: IFileWithData[]){
    this.parser.parseFiles(files);
  }
}
