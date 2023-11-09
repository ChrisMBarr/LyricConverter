import { Component, Input, OnInit, inject } from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

import { IOutputFile } from '../models/file.model';

@Component({
  selector: 'app-slide-display',
  templateUrl: './slide-display.component.html',
})
export class SlideDisplayComponent implements OnInit {
  private readonly $gaService = inject(GoogleAnalyticsService);

  @Input() outputFileList: Array<IOutputFile> = [];

  ngOnInit(): void {
    this.$gaService.event('display_slides', 'convert', undefined, this.outputFileList.length, true);
  }
}
