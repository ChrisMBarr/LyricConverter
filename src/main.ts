import { bootstrapApplication } from '@angular/platform-browser';
import { Buffer } from 'buffer';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

window.Buffer = Buffer; // Needed for SongShowPlus-Parser

bootstrapApplication(AppComponent, appConfig).catch((err: unknown) => {
  console.error(err);
});
