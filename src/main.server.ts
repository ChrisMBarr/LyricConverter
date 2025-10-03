import { ApplicationRef } from '@angular/core';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext): Promise<ApplicationRef> =>
  bootstrapApplication(AppComponent, config, context);

export default bootstrap;
