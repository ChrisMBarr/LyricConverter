import { Component, Input } from '@angular/core';
import { IOutputFile } from '../models/file.model';

@Component({
  selector: 'app-slide-display',
  templateUrl: './slide-display.component.html',
  styleUrls: ['./slide-display.component.css'],
})
export class SlideDisplayComponent {
  @Input() outputFileList: IOutputFile[] = [];
}
