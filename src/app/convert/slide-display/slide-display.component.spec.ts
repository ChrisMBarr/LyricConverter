import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideDisplayComponent } from './slide-display.component';
import { By } from '@angular/platform-browser';
import { mockOutputFiles } from 'test/mock-output-files';

describe('SlideDisplayComponent', () => {
  let component: SlideDisplayComponent;
  let fixture: ComponentFixture<SlideDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SlideDisplayComponent],
    });
    fixture = TestBed.createComponent(SlideDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the song data in the UI for a single song', () => {
    const mockFilesCopy = [...mockOutputFiles][0]!;
    component.outputFileList = [mockFilesCopy];

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.song')).length).toEqual(1);
    expect(fixture.debugElement.query(By.css('.song-title')).nativeElement.textContent).toEqual(
      mockFilesCopy.songData.title
    );

    //Song Info
    mockFilesCopy.songData.info.forEach((info, idx) => {
      expect(
        fixture.debugElement
          .query(By.css(`.song-info li:nth-of-type(${idx + 1})`))
          .nativeElement.textContent.trim()
      ).toEqual(`${info.name}: ${info.value}`);
    });

    //Song Lyrics/Slides
    mockFilesCopy.songData.slides.forEach((slide, idx) => {
      expect(
        fixture.debugElement
          .query(
            By.css(`.song-slides-container .col:nth-of-type(${idx + 1}) .song-slide .card-body`)
          )
          .nativeElement.textContent.trim()
      ).toEqual(slide.lyrics);
      expect(
        fixture.debugElement
          .query(
            By.css(`.song-slides-container .col:nth-of-type(${idx + 1}) .song-slide .card-footer`)
          )
          .nativeElement.textContent.trim()
      ).toEqual(slide.title);
    });
  });

  it('should display the song data in the UI for multiple songs', () => {
    const mockFiles = [...mockOutputFiles];
    component.outputFileList = mockFiles;

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.song')).length).toEqual(2);

    mockFiles.forEach((f, fileIdx) => {
      expect(
        fixture.debugElement.query(By.css(`.song:nth-of-type(${fileIdx + 1}) .song-title`))
          .nativeElement.textContent
      ).toEqual(f.songData.title);

      //Song Info
      f.songData.info.forEach((info, idx) => {
        expect(
          fixture.debugElement
            .query(
              By.css(`.song:nth-of-type(${fileIdx + 1}) .song-info li:nth-of-type(${idx + 1})`)
            )
            .nativeElement.textContent.trim()
        ).toEqual(`${info.name}: ${info.value}`);
      });

      //Song Lyrics/Slides
      f.songData.slides.forEach((slide, idx) => {
        expect(
          fixture.debugElement
            .query(
              By.css(
                `.song:nth-of-type(${fileIdx + 1}) .song-slides-container .col:nth-of-type(${
                  idx + 1
                }) .song-slide .card-body`
              )
            )
            .nativeElement.textContent.trim()
        ).toEqual(slide.lyrics);
        expect(
          fixture.debugElement
            .query(
              By.css(
                `.song:nth-of-type(${fileIdx + 1}) .song-slides-container .col:nth-of-type(${
                  idx + 1
                }) .song-slide .card-footer`
              )
            )
            .nativeElement.textContent.trim()
        ).toEqual(slide.title);
      });
    });
  });
});
