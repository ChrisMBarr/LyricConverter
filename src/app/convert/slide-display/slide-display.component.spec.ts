import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { mockOutputFiles } from 'test/mock-output-files';

import { SlideDisplayComponent } from './slide-display.component';

describe('SlideDisplayComponent', () => {
  let component: SlideDisplayComponent;
  let fixture: ComponentFixture<SlideDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SlideDisplayComponent],
    });
    fixture = TestBed.createComponent(SlideDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the song data in the UI for a single song', () => {
    const mockFilesCopy = structuredClone(mockOutputFiles[0]!);
    component.outputFileList = [mockFilesCopy];

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.card')).length).toEqual(1);
    expect((fixture.debugElement.query(By.css('h3')).nativeElement as HTMLElement).textContent).toEqual(mockFilesCopy.songData.title);

    //Song Info
    mockFilesCopy.songData.info.forEach((info, idx) => {
      const a = `${info.name} ${info.value.toString()}`;
      const b = (fixture.debugElement.query(By.css(`ul li:nth-of-type(${(idx + 1).toString()})`)).nativeElement as HTMLElement).textContent!.trim();

      expect(a).toEqual(b);
    });

    //Song Lyrics/Slides
    mockFilesCopy.songData.slides.forEach((slide, idx) => {
      expect(
        (
          fixture.debugElement.query(By.css(`[data-test='song-slides-container'] > div:nth-of-type(${(idx + 1).toString()}) p`))
            .nativeElement as HTMLElement
        ).textContent!.trim(),
      ).toEqual(slide.lyrics);
      expect(
        (
          fixture.debugElement.query(By.css(`[data-test='song-slides-container'] > div:nth-of-type(${(idx + 1).toString()}) footer`))
            .nativeElement as HTMLElement
        ).textContent!.trim(),
      ).toEqual(slide.title);
    });
  });

  it('should display the song data in the UI for multiple songs', () => {
    const mockFiles = structuredClone(mockOutputFiles);
    component.outputFileList = mockFiles;

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.card')).length).toEqual(2);

    mockFiles.forEach((f, fileIdx) => {
      expect(
        (fixture.debugElement.query(By.css(`.card:nth-of-type(${(fileIdx + 1).toString()}) h3`)).nativeElement as HTMLElement).textContent,
      ).toEqual(f.songData.title);

      //Song Info
      f.songData.info.forEach((info, idx) => {
        expect(
          (
            fixture.debugElement.query(By.css(`.card:nth-of-type(${(fileIdx + 1).toString()}) ul li:nth-of-type(${(idx + 1).toString()})`))
              .nativeElement as HTMLElement
          ).textContent!.trim(),
        ).toEqual(`${info.name} ${info.value.toString()}`);
      });

      //Song Lyrics/Slides
      f.songData.slides.forEach((slide, idx) => {
        expect(
          (
            fixture.debugElement.query(
              By.css(
                `.card:nth-of-type(${(fileIdx + 1).toString()}) [data-test='song-slides-container'] > div:nth-of-type(${(idx + 1).toString()}) p`,
              ),
            ).nativeElement as HTMLElement
          ).textContent!.trim(),
        ).toEqual(slide.lyrics);
        expect(
          (
            fixture.debugElement.query(
              By.css(
                `.card:nth-of-type(${(fileIdx + 1).toString()}) [data-test='song-slides-container'] > div:nth-of-type(${(idx + 1).toString()}) footer`,
              ),
            ).nativeElement as HTMLElement
          ).textContent!.trim(),
        ).toEqual(slide.title);
      });
    });
  });
});
