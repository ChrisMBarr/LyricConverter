import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { ConvertComponent } from './convert/convert.component';
import { DonateButtonComponent } from './donate-button/donate-button.component';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    AboutComponent,
    ConvertComponent,
    DonateButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
