import { IOutputFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { STRING_LIST_SEPARATOR_JOIN, STRING_LIST_SEPARATOR_SPLIT } from '../shared/constants';
import { Utils } from '../shared/utils';
import { IOutputConverter } from './output-converter.model';
const packageFile = require('/package.json');

export class OutputTypeOpenLyrics implements IOutputConverter {
  readonly name = 'OpenLyrics';
  readonly fileExt = 'xml';

  convertToType(song: ISong): IOutputFile {
    const fileContent = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.9"
      createdIn="LyricConverter ${packageFile.version}"
      modifiedIn="LyricConverter ${packageFile.version}"
      modifiedDate="${Utils.getIsoDateString()}">
  <properties>
    <titles>
      <title>${song.title}</title>
    </titles>${this.buildPropertiesXmlNodes(song.info)}
  </properties>
  <lyrics>${this.buildLyricsXmlNodes(song.slides)}
  </lyrics>
</song>`;

    // console.groupCollapsed(song.title);
    // console.log(song);
    // console.log(fileContent);
    // console.groupEnd();

    return {
      songData: song,
      fileName: `${song.fileName}.${this.fileExt}`,
      outputContent: fileContent,
    };
  }

  private buildPropertiesXmlNodes(info: ISongInfo[]): string {
    //OpenLyrics has specific XML node names for certain values
    //We need to search through what we have for possible matches
    //The rest will be discarded

    //First we add all the possible single-node properties
    let propertiesXml = this.findInfoAndMakeXmlProperty(info, /(year)|(copyright)/i, 'copyright');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /(year)|(released)/i, 'released');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /(ccliNo)|(CCLI ?Number)/i, 'ccliNo');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^transposition$/i, 'transposition');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^key$/i, 'key');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^variant$/i, 'variant');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^publisher$/i, 'publisher');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^keywords$/i, 'keywords');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /order/i, 'verseOrder');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /time ?signature/i, 'timeSignature');

    //Many of these next properties can have multiple values.
    //Instead of looping over all the info properties once per property we are looking for
    // we just do it once and pull everything we need out for all the below nested property nodes
    const authorsInfo: ISongInfo[] = [];
    let themesInfo: ISongInfo | undefined;
    let tempoInfo: ISongInfo | undefined;
    const commentsInfo: ISongInfo[] = [];
    const songBookInfo: ISongInfo[] = [];
    info.forEach((i) => {
      if (/(artist)|(author)/i.test(i.name)) {
        authorsInfo.push(i);
      } else if (i.name.toLowerCase().startsWith('theme')) {
        //there should only be one of these, an array is not needed for themes
        themesInfo = i;
      } else if (i.name.toLowerCase() === 'tempo') {
        //there should only be one of these, an array is not needed for themes
        tempoInfo = i;
      } else if (i.name.toLowerCase().startsWith('comment')) {
        commentsInfo.push(i);
      } else if (/^song ?book/i.test(i.name)) {
        songBookInfo.push(i);
      }
    });

    if (authorsInfo.length > 0) {
      //Each found value might contain a multi-value string.
      //We combine all of these with the same separator into a single string,
      //and then split it all back out into an array
      const combined = authorsInfo
        .map((a) => a.value)
        .join(STRING_LIST_SEPARATOR_JOIN)
        .split(STRING_LIST_SEPARATOR_SPLIT);
      propertiesXml += '\n' + this.createXmlNodeAndChildren('authors', 4, 'author', 6, combined);
    }

    if (themesInfo) {
      propertiesXml +=
        '\n' +
        this.createXmlNodeAndChildren(
          'themes',
          4,
          'theme',
          6,
          themesInfo.value.toString().split(STRING_LIST_SEPARATOR_SPLIT)
        );
    }

    if (tempoInfo) {
      //Tempo can be two different types: 'bpm' or 'text'
      //'90bpm' --> '<tempo type="bpm">90</tempo>'
      //'moderate' --> '<tempo type="text">moderate</tempo>'
      let attrValue = 'text'
      let tagContent = tempoInfo.value.toString();

      if(tagContent.includes('bpm')){
        attrValue = 'bpm';
        tagContent = tagContent.replace('bpm', '')
      }

      propertiesXml += (
        '\n' +
        this.createXmlNode('tempo', 4, tagContent, false, [{ name: 'type', value: attrValue }])
      );
    }

    if (commentsInfo.length > 0) {
      //Each found value might contain a multi-value string.
      //We combine all of these with the same separator into a single string,
      //and then split it all back out into an array
      const combined = commentsInfo
        .map((a) => a.value)
        .join(STRING_LIST_SEPARATOR_JOIN)
        .split(STRING_LIST_SEPARATOR_SPLIT);
      propertiesXml += '\n' + this.createXmlNodeAndChildren('comments', 4, 'comment', 6, combined);
    }

    if (songBookInfo.length > 0) {
      const songbooksContent =
        '\n' +
        songBookInfo
          .map((sb) => {
            let nameAttrValue = sb.value;
            let entryAttr = '';
            const sbMatch = /^([\w\s]+)(\(:?entry ([0-9a-z]+)\))?$/i.exec(sb.value.toString());

            if (sbMatch?.[1] != null && sbMatch[3] != null) {
              nameAttrValue = sbMatch[1].trim();
              entryAttr = ` entry="${sbMatch[3]}"`;
            }

            return `      <songbook name="${nameAttrValue}"${entryAttr} />`;
          })
          .join('\n') +
        '\n      ';
      propertiesXml += '\n' + this.createXmlNode('songbooks', 4, songbooksContent);
    }

    return propertiesXml;
  }

  private buildLyricsXmlNodes(slidesList: ISongSlide[]): string {
    let lyricsXmlStr = '';
    const linesTextIndent = ' '.repeat(8);

    //We will only create a <verse> tag that contains one <lines> element
    //The line breaks in the lyrics will be converted to HTML <br> tags
    for (const slide of slidesList) {
      //Don't add slides/verses with empty lyrics
      if (slide.lyrics !== '') {
        const linesContent =
          '\n' +
          linesTextIndent +
          slide.lyrics.split('\n').join('<br/>\n' + linesTextIndent) +
          '\n      ';
        lyricsXmlStr +=
          '\n' +
          this.createXmlNodeAndChildren(
            'verse',
            4,
            'lines',
            6,
            [linesContent],
            [{ name: 'name', value: slide.title }]
          );
      }
    }

    return lyricsXmlStr;
  }

  private findInfoAndMakeXmlProperty(
    info: ISongInfo[],
    namePattern: RegExp,
    tagName: string,
    attrName?: string
  ): string {
    const infoMatch = info.find((i) => namePattern.test(i.name));
    let attrs: ISongInfo[] | undefined;
    if (infoMatch !== undefined) {
      if (attrName !== undefined) {
        const attrValue = infoMatch.value.toString();
        attrs = [{ name: attrName, value: attrValue }];
      }

      const tagContent = infoMatch.value.toString();
      return '\n' + this.createXmlNode(tagName, 4, tagContent, false, attrs);
    }
    return '';
  }

  private createXmlNode(
    tagName: string,
    indentLevel: number,
    content: string,
    indentClosingTag = false,
    attrs?: ISongInfo[]
  ): string {
    let attrString = '';
    if (attrs) {
      attrString = attrs.map((a) => ` ${a.name}="${a.value}"`).join(' ');
    }
    const indent = ' '.repeat(indentLevel);
    const closingIndent = indentClosingTag ? indent : '';
    return `${indent}<${tagName}${attrString}>${content}${closingIndent}</${tagName}>`;
  }

  private createXmlNodeAndChildren(
    parentTag: string,
    parentIndentLevel: number,
    childTag: string,
    childIndentLevel: number,
    childTagsContent: string[],
    attrs?: ISongInfo[]
  ): string {
    //Creates an XML node wrapper, and child nodes for one or multiple properties in a string separated by commas
    let xml = '';
    if (childTagsContent.length) {
      const innerTags =
        childTagsContent
          .map((content) => `\n${this.createXmlNode(childTag, childIndentLevel, content)}`)
          .join('') + '\n';

      xml += this.createXmlNode(parentTag, parentIndentLevel, innerTags, true, attrs);
    }
    return xml;
  }
}
