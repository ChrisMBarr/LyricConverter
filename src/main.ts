import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AppRoutingModule } from './app/app-routing.module';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(AppComponent, {
    providers: [importProvidersFrom(AppRoutingModule, BrowserModule)]
})
  .catch((err: unknown) => {
    console.error(err);
  });
