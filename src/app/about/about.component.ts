import { Component } from '@angular/core';
import { DonateButtonComponent } from '../donate-button/donate-button.component';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    imports: [DonateButtonComponent]
})
export class AboutComponent {}
