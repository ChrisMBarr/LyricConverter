import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideDisplayComponent } from './slide-display.component';
import { By } from '@angular/platform-browser';
import { mockOutputFiles } from 'test/mock-output-files';
import { TestUtils } from 'test/test-utils';

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
    const mockFilesCopy = TestUtils.deepClone(mockOutputFiles[0]!);
    component.outputFileList = [mockFilesCopy];

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.card')).length).toEqual(1);
    expect(fixture.debugElement.query(By.css('h3')).nativeElement.textContent).toEqual(
      mockFilesCopy.songData.title
    );

    //Song Info
    mockFilesCopy.songData.info.forEach((info, idx) => {
      const a = `${info.name} ${info.value}`;
      const b: string = fixture.debugElement
      .query(By.css(`ul li:nth-of-type(${idx + 1})`))
      .nativeElement.textContent.trim();

      console.group(a)
      a.split('').forEach((c, i)=>{
        console.log(c, c.charCodeAt(0), b[i], b.charCodeAt(i));
      })
      console.groupEnd()

      expect(
        a
      ).toEqual(b);
    });

    //Song Lyrics/Slides
    mockFilesCopy.songData.slides.forEach((slide, idx) => {
      expect(
        fixture.debugElement
          .query(
            By.css(`.test-song-slides-container > div:nth-of-type(${idx + 1}) p`)
          )
          .nativeElement.textContent.trim()
      ).toEqual(slide.lyrics);
      expect(
        fixture.debugElement
          .query(
            By.css(`.test-song-slides-container > div:nth-of-type(${idx + 1}) footer`)
          )
          .nativeElement.textContent.trim()
      ).toEqual(slide.title);
    });
  });

  it('should display the song data in the UI for multiple songs', () => {
    const mockFiles = TestUtils.deepClone(mockOutputFiles);
    component.outputFileList = mockFiles;

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css('.card')).length).toEqual(2);

    mockFiles.forEach((f, fileIdx) => {
      expect(
        fixture.debugElement.query(By.css(`.card:nth-of-type(${fileIdx + 1}) h3`))
          .nativeElement.textContent
      ).toEqual(f.songData.title);

      //Song Info
      f.songData.info.forEach((info, idx) => {
        expect(
          fixture.debugElement
            .query(
              By.css(`.card:nth-of-type(${fileIdx + 1}) ul li:nth-of-type(${idx + 1})`)
            )
            .nativeElement.textContent.trim()
        ).toEqual(`${info.name} ${info.value}`);
      });

      //Song Lyrics/Slides
      f.songData.slides.forEach((slide, idx) => {
        expect(
          fixture.debugElement
            .query(
              By.css(
                `.card:nth-of-type(${fileIdx + 1}) .test-song-slides-container > div:nth-of-type(${
                  idx + 1
                }) p`
              )
            )
            .nativeElement.textContent.trim()
        ).toEqual(slide.lyrics);
        expect(
          fixture.debugElement
            .query(
              By.css(
                `.card:nth-of-type(${fileIdx + 1}) .test-song-slides-container > div:nth-of-type(${
                  idx + 1
                }) footer`
              )
            )
            .nativeElement.textContent.trim()
        ).toEqual(slide.title);
      });
    });
  });
});
