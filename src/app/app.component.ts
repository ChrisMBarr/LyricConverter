import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { version } from './version';

@Component({
  selector: 'app-root',
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private readonly document: Document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly backgroundImagesCount = 8;

  ngOnInit(): void {
    //Set the version number in the meta tag, maybe useful for prerendering & SEO, and just to know which version is deployed
    this.document.head.querySelector('meta[name="version"]')?.setAttribute('content', version);

    //don't set a random BG image when generating the pre-rendered routes
    if (!isPlatformServer(this.platformId)) {
      const randomNum = Math.floor(Math.random() * this.backgroundImagesCount + 1);
      this.document.body.style.backgroundImage = `url('/assets/background/bg${randomNum.toString()}.jpg')`;
    }
  }
}
