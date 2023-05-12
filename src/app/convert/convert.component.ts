import { Component } from '@angular/core';
import { ParserService } from './parser/parser.service';

@Component({
  selector: 'app-convert',
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})
export class ConvertComponent {

  constructor(private parser: ParserService){}

  onFileDrop(files: FileList){
    this.parser.parseFiles(files);
  }
}
