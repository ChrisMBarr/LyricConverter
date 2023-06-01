import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private readonly backgroundImagesCount = 8;
  randomBackgroundImagePath = `/assets/bg1.jpg`; //default just in case
  title = 'Lyric Converter';

  ngOnInit(): void {
    const randomNum = Math.floor(Math.random() * this.backgroundImagesCount + 1);
    this.randomBackgroundImagePath = `/assets/bg${randomNum}.jpg`;
  }
}
