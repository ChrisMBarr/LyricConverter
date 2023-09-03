import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { ConvertComponent } from './convert/convert.component';
import { DonateButtonComponent } from './donate-button/donate-button.component';
import { DragAndDropFilesDirective } from './drag-and-drop-files/drag-and-drop-files.directive';
import { HelpComponent } from './help/help.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let injectedDocument: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, HelpComponent, AboutComponent, ConvertComponent, DonateButtonComponent, DragAndDropFilesDirective],
    });

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    injectedDocument = fixture.debugElement.injector.get(DOCUMENT);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should set a random background image on the <body> element', () => {
    fixture.detectChanges();
    expect(injectedDocument.body.getAttribute('style')).toMatch(/background-image: url\("\/assets\/bg\d+.jpg"\);/);
  });
});
