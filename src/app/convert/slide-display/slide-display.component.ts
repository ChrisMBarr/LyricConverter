import { Component, Input } from '@angular/core';

import { IOutputFile } from '../models/file.model';

@Component({
    selector: 'app-slide-display',
    templateUrl: './slide-display.component.html',
    standalone: false
})
export class SlideDisplayComponent {
  @Input() outputFileList: Array<IOutputFile> = [];
}
