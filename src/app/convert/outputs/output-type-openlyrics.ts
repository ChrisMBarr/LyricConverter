import { IOutputFile } from '../models/file.model';
import { ISong, ISongInfo, ISongSlide } from '../models/song.model';
import { Utils } from '../utils/utils';
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
  <lyrics>
    ${this.buildLyricsXmlNodes(song.slides)}
  </lyrics>
</song>`;

    console.log(song, fileContent);

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
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^tempo$/i, 'tempo', 'bpm', /bpm/i);
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^variant$/i, 'variant');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^publisher$/i, 'publisher');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /^keywords$/i, 'keywords');
    propertiesXml += this.findInfoAndMakeXmlProperty(info, /order/i, 'verseOrder');

    //These next properties can have multiple values.
    //We will take the info values and split each comma separated value into a new child-node
    const authorsInfo = info.filter((i) => /(artist)|(author)/i.test(i.name));
    if (authorsInfo.length > 0) {
      const combined = authorsInfo.map((a) => a.value).join(', ');
      propertiesXml += this.createXmlNodeAndChildren('authors', 'author', combined);
    }

    const themesInfo = info.find((i) => i.name.toLowerCase().startsWith('theme'));
    if (themesInfo) {
      propertiesXml += this.createXmlNodeAndChildren(
        'themes',
        'theme',
        themesInfo.value.toString()
      );
    }

    const commentsInfo = info.filter((i) => i.name.toLowerCase().startsWith('comment'));
    if (commentsInfo.length > 0) {
      const combined = commentsInfo.map((a) => a.value).join(', ');
      propertiesXml += this.createXmlNodeAndChildren('comments', 'comment', combined);
    }

    return propertiesXml;
  }

  private buildLyricsXmlNodes(_slides: ISongSlide[]): string {
    return '';
  }

  private findInfoAndMakeXmlProperty(
    info: ISongInfo[],
    namePattern: RegExp,
    tagName: string,
    attrName?: string,
    attrValueReplacePattern?: RegExp
  ): string {
    const infoMatch = info.find((i) => namePattern.test(i.name));
    let attrs: ISongInfo[] | undefined;
    if (infoMatch !== undefined) {
      if (attrName !== undefined) {
        let val = infoMatch.value.toString();
        if (attrValueReplacePattern) {
          val = val.replace(attrValueReplacePattern, '');
        }
        attrs = [{ name: attrName, value: val }];
      }

      return '\n    ' + this.createXmlNode(tagName, infoMatch.value.toString(), attrs);
    }
    return '';
  }

  private createXmlNode(tagName: string, content: string, attrs?: ISongInfo[]): string {
    let attrString = '';
    if (attrs) {
      attrString = attrs.map((a) => ` ${a.name}="${a.value}"`).join(' ');
    }
    return `<${tagName}${attrString}>${content}</${tagName}>\n`;
  }

  private createXmlNodeAndChildren(
    parentTag: string,
    childTag: string,
    commaSeparatedString: string
  ): string {
    //Creates an XML node wrapper, and child nodes for one or multiple properties in a string separated by commas
    let xml = '';
    if (commaSeparatedString) {
      const innerTags = commaSeparatedString
        //String lists might be separated by commas or pipes
        .split(/[,|]/)
        .map((a) => `\n      ${this.createXmlNode(childTag, a.trim())}`)
        .join('');

      xml += this.createXmlNode(parentTag, innerTags);
    }
    return xml;
  }
}
