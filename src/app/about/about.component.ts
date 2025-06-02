import { Component } from '@angular/core';

import { DonateButtonComponent } from '../donate-button/donate-button.component';

@Component({
  selector: 'app-about',
  imports: [DonateButtonComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent {}
