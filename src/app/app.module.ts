import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { ConvertComponent } from './convert/convert.component';
import { DonateButtonComponent } from './donate-button/donate-button.component';
import { DragAndDropFilesDirective } from './drag-and-drop-files/drag-and-drop-files.directive';
import { SlideDisplayComponent } from './convert/slide-display/slide-display.component';
import { DownloadDisplayComponent } from './convert/download-display/download-display.component';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    AboutComponent,
    ConvertComponent,
    DonateButtonComponent,
    DragAndDropFilesDirective,
    SlideDisplayComponent,
    DownloadDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGoogleAnalyticsModule.forRoot(isDevMode() ? '' : 'G-1W69G30JB8'),
    NgxGoogleAnalyticsRouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
