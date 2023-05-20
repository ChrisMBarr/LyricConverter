import { IRawDataFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { TextCleaner } from '../utils/text-cleaner';
import { IInputConverter } from './input-converter.model';

export class InputTypeSongShowPlus7 implements IInputConverter {
  name = 'SongShow Plus 7';

  doesInputFileMatchThisType(file: IRawDataFile): boolean {
    //TODO: Determine a way to check the version or if that's even important!
    return file.ext.toLowerCase() === 'sbsong';
  }

  extractSongData(rawFile: IRawDataFile): ISong {
    let title = rawFile.name; //default/fallback name
    let info: ISongInfo[] = [];
    let slides: ISongSlide[] = [];

    //We don't want any properties XML tags which can sometimes begin the file.
    //Splitting these out and then taking the first array item can prevent this.
    //Each song sections seems to be split up by a percent sign, so make an array by splitting on that
    const propSections = rawFile.data.split('<Properties>');
    if (propSections[0] != null) {
      const sections = propSections[0].split('%');

      if (sections.length > 0) {
        //Pass all the sections in here to get the lyrics
        //We will get out the slides and the keywords
        const slideContent = this.getSlidesAndKeywords(sections);
        slides = slideContent.slides;

        if (sections[0] != null) {
          //The info is all contained in the first section, so only pass that in and pass in the keywords from above
          const parsedInfo = this.getTitleAndInfo(sections[0], slideContent.keywords, rawFile.name);
          title = parsedInfo.title;
          info = parsedInfo.info;
        }
      }
    }

    return {
      fileName: rawFile.name,
      title,
      info,
      slides,
    };
  }

  //Regex pattern AS A STRING to match invisible control characters
  //Slashes are double escaped here so it can be in a string!
  private readonly patternInvisibleCharsStr = '[\\xA0\\x00-\\x09\\x0B\\x0C\\x0E-\\x1F\\x7F]';
  //Same pattern, but as a real RexExp object
  private readonly patternInvisibleChars = new RegExp(this.patternInvisibleCharsStr, 'g');

  private getTitleAndInfo(
    firstSection: string,
    keywords: string,
    fileName: string
  ): { title: string; info: ISongInfo[] } {
    //Split the info up into an array by the invisible characters
    //Then remove all empty items and items that are only 1 character long
    const infoArray = firstSection
      .split(this.patternInvisibleChars)
      .filter((n) => n.trim().replace(/\r\n\t/g, '').length > 1);

    let songTitle = fileName; //Fallback title

    if (infoArray.length > 0 && (infoArray[0] != null)) {
      //If the first items is a number between 1 and 4 digits, remove it
      if (/[0-9]{1,4}/.test(infoArray[0])) {
        infoArray.splice(0, 1);
      }

      //Remove dollar signs from the title
      songTitle = infoArray[0].replace(/\$/g, '');
    }

    //Convert characters as needed - useful for non-English alphabets (Spanish)
    songTitle = TextCleaner.convertWin1252ToUtf8(songTitle);

    return {
      info: this.getSongInfo(infoArray, keywords),
      title: songTitle,
    };
  }

  private getSongInfo(infoArray: string[], keywords: string): ISongInfo[] {
    const songInfo = [];

    if (infoArray[1] != null) {
      songInfo.push({
        name: 'Artist/Author',
        value: infoArray[1].trim(),
      });
    }

    //If the copyright exists, add it
    if (infoArray[2] != null) {
      songInfo.push({
        name: 'Copyright',
        value: infoArray[2].replace('$', '').trim(), //copyright info tends to end with a $ sign, so remove it
      });
    }

    //If the CCLI exists, add it
    if (infoArray[3] != null) {
      songInfo.push({
        name: 'CCLI',
        value: infoArray[3].trim(),
      });
    }

    //If we have keywords, add them
    if (keywords) {
      songInfo.push({
        name: 'Keywords',
        value: keywords.trim(),
      });
    }

    for (const info of songInfo) {
      info.value = TextCleaner.convertWin1252ToUtf8(info.value);
    }

    return songInfo;
  }

  private cleanOddCharsFromSlideTitles(lyrics: string): string {
    //Convert character encodings - useful for non-English alphabets (Spanish)
    return (
      TextCleaner.convertWin1252ToUtf8(lyrics)
        //Sometime slide titles will end with an odd character
        //If the last character isn't a letter, number, or closing parenthesis then remove it
        .replace(/[^a-z0-9)]$/i, '')
    );
  }

  private cleanOddCharsFromSlideLyrics(lyrics: string): string {
    return (
      //Convert character encodings - useful for non-English alphabets (Spanish)
      TextCleaner.convertWin1252ToUtf8(lyrics)
        //Replace multiple slashes sometimes?
        //Also remove some strange ugly characters...
        .replace(/\/+|¶/g, '')
        //remove beginning/ending whitespace
        .trim()
        //Sometimes the first character of lyrics is a random lowercase letter
        //If we have a lowercase letter first and then an uppercase letter, remove that first character
        .replace(/^[a-z]([A-Z])/, '$1')
        //If the last characters are newlines followed by a non-letter character, remove them
        .replace(/[\n\r]+[^a-z]$/i,'')
    );
  }

  private createInitialSlidesArray(sections: string[]): ISongSlide[] {
    const slideArray = [];

    //Sections tend to begin with N number of control characters, a random print character, more control characters, and then the title "Verse 1" or something
    //After that is the actual song lyrics, but it may be proceeded by one non-word character
    //Slashes are double escaped here so it can be in a string!
    const slidePattern = new RegExp(
      '^' +
        this.patternInvisibleCharsStr +
        '+.{1}' +
        this.patternInvisibleCharsStr +
        '+(.+)' +
        this.patternInvisibleCharsStr +
        '+\\W*([\\s\\S]+)',
      'm'
    );

    //Loop through the sections
    //But SKIP the first one since it contains the song info we don't need here
    for (let i = 1; i < sections.length; i++) {
      const thisSection = sections[i] ?? /* istanbul ignore next */ '';
      //Run the regex on each section to split out the slide title from the lyrics
      const matches = thisSection.match(slidePattern);
      let slideTitle = '';
      let slideLyrics = '';

      //Remove whitespace from the title
      if (matches != null) {
        if (matches[1] != null) {
          slideTitle = matches[1].replace(this.patternInvisibleChars, '').trim();
        }
        if (matches[2] != null) {
          //Remove any more invisible chars from the lyrics and remove whitespace
          slideLyrics = matches[2].replace(this.patternInvisibleChars, '').trim();
        }
      }

      slideTitle = this.cleanOddCharsFromSlideTitles(slideTitle);
      slideLyrics = this.cleanOddCharsFromSlideLyrics(slideLyrics);

      //don't add slides with empty lyrics
      if (slideLyrics !== '') {
        slideArray.push({
          title: slideTitle,
          lyrics: slideLyrics,
        });
      }
    }

    return slideArray;
  }

  private getSlidesAndKeywords(sections: string[]): { slides: ISongSlide[]; keywords: string } {
    const slideArray = this.createInitialSlidesArray(sections);

    //The last slide also contains the keywords, we need to parse these out separately
    const lastSlideObj = this.getKeywordsFromLastSlide(sections.slice(-1)[0]);
    let keywords = '';
    if (lastSlideObj.lastLyrics !== '') {
      //If we have no slides, and what we think are keywords are longer than the lyrics...
      //Then we might need to switch them for some reason...
      if (
        slideArray.length === 0 &&
        lastSlideObj.keywords.length > lastSlideObj.lastLyrics.length
      ) {
        keywords = lastSlideObj.lastLyrics;

        slideArray.push({
          title: '',
          lyrics: lastSlideObj.keywords.replace(/\/+/g, ''),
        });
      } else {
        keywords = lastSlideObj.keywords;
        if (slideArray.length > 0) {
          const lastSlide = slideArray.slice(-1)[0];
          if (lastSlide) {
            lastSlide.lyrics = lastSlideObj.lastLyrics;
          }
        } else {
          slideArray.push({
            title: '',
            lyrics: lastSlideObj.lastLyrics.replace(/\/+/g, ''),
          });
        }
      }
    }

    //Only add it if the title and the lyrics don't match. Sometimes they do for some reason...
    const finalArray = [];
    for (const s of slideArray) {
      if (s.title.trim().toLowerCase() !== s.lyrics.trim().toLowerCase()) {
        finalArray.push(s);
      }
    }

    return {
      slides: finalArray,
      keywords,
    };
  }

  private getKeywordsFromLastSlide(lastSlideRaw: string | undefined): {
    keywords: string;
    lastLyrics: string;
  } {
    let keywords = '';
    let lastLyrics = '';

    if (lastSlideRaw != null) {
      //Remove all empty items and items that are only 1 character long
      const infoArray = lastSlideRaw
        .split(this.patternInvisibleChars)
        .filter((n: string) => n.trim().length > 1);

      //If we have at least 3 sections, then we have keywords
      if (infoArray.length > 2) {
        //The keywords are the entire array except for the first two items
        keywords = infoArray
          .splice(2)
          .map((x) => x.replace(/[\r\n\t]*/g, ''))
          .join(', ');

        if (infoArray.length > 0 && (infoArray[1] != null)) {
          //Return the last slide minus the keywords, then parse out the optional beginning non-word character
          const lastSlideNonWordsRemoved = /^\W*([\s\S]+)/m.exec(infoArray[1]);

          if (lastSlideNonWordsRemoved?.[1] != null) {
            lastLyrics = lastSlideNonWordsRemoved[1];
          }
        }

        //Convert characters as needed - useful for non-english alphabets (Spanish)
        keywords = TextCleaner.convertWin1252ToUtf8(keywords);
        lastLyrics = this.cleanOddCharsFromSlideLyrics(lastLyrics);
      }
    }

    return {
      keywords,
      lastLyrics,
    };
  }
}
