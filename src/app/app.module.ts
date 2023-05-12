import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { ConvertComponent } from './convert/convert.component';
import { DonateButtonComponent } from './donate-button/donate-button.component';
import { DragAndDropFilesDirective } from './drag-and-drop-files/drag-and-drop-files.directive';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    AboutComponent,
    ConvertComponent,
    DonateButtonComponent,
    DragAndDropFilesDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
