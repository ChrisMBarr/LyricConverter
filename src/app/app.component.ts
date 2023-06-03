import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private readonly backgroundImagesCount = 8;
  title = 'Lyric Converter';

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  ngOnInit(): void {
    const randomNum = Math.floor(Math.random() * this.backgroundImagesCount + 1);
    this.document.body.style.backgroundImage = `url('/assets/bg${randomNum}.jpg')`;
  }
}
