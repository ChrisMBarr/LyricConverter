import { Component, Input, OnInit, inject } from '@angular/core';
import { IOutputFile } from '../models/file.model';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-slide-display',
  templateUrl: './slide-display.component.html',
  styleUrls: ['./slide-display.component.css'],
})
export class SlideDisplayComponent implements OnInit {
  private readonly $gaService = inject(GoogleAnalyticsService);

  @Input() outputFileList: IOutputFile[] = [];

  ngOnInit(): void {
    this.$gaService.event('display_slides', 'convert', undefined, this.outputFileList.length, true);
  }
}
