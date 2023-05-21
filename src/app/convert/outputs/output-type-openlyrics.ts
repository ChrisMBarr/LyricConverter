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
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^tempo$/i, 'tempo', 'type', /\d+/i, /\D+/);
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^variant$/i, 'variant');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^publisher$/i, 'publisher');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^keywords$/i, 'keywords');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /order/i, 'verseOrder');

    //These next properties can have multiple values.
    //We will take the info values and split each comma separated value into a new child-node
    const authorsInfo = info.filter((i) => /(artist)|(author)/i.test(i.name));
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

    const themesInfo = info.find((i) => i.name.toLowerCase().startsWith('theme'));
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

    const commentsInfo = info.filter((i) => i.name.toLowerCase().startsWith('comment'));
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
    attrName?: string,
    attrValueReplacePattern?: RegExp,
    contentReplacePattern?: RegExp
  ): string {
    const infoMatch = info.find((i) => namePattern.test(i.name));
    let attrs: ISongInfo[] | undefined;
    if (infoMatch !== undefined) {
      if (attrName !== undefined) {
        let attrValue = infoMatch.value.toString();
        if (attrValueReplacePattern) {
          attrValue = attrValue.replace(attrValueReplacePattern, '');
        }
        attrs = [{ name: attrName, value: attrValue }];
      }

      let tagContent = infoMatch.value.toString();
      if(contentReplacePattern){
        tagContent = tagContent.replace(contentReplacePattern, '');
      }

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
          .map((a) => `\n${this.createXmlNode(childTag, childIndentLevel, a)}`)
          .join('') + '\n';

      xml += this.createXmlNode(parentTag, parentIndentLevel, innerTags, true, attrs);
    }
    return xml;
  }
}
