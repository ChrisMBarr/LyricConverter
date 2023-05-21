import { IOutputFile } from '../models/file.model';
import { ISong } from '../models/song.model';
import { Utils } from '../utils/utils';
import { IOutputConverter } from './output-converter.model';
const packageFile = require('/package.json');

export class OutputTypeOpenLyrics implements IOutputConverter {
  readonly name = 'OpenLyrics';
  readonly fileExt = 'xml';

  convertToType(song: ISong): IOutputFile {
    const fileContent = this.getFileContent(song.title, '', '', '');

    console.log(song, fileContent);

    return {
      songData: song,
      fileName: `${song.fileName}.${this.fileExt}`,
      outputContent: fileContent,
    };
  }

  private createXmlNodeAndChildren(
    parentTag: string,
    childTag: string,
    commaSeparatedString: string
  ): string {
    //Creates an XML node for one or multiple properties in a string separated by commas
    let xml = '';
    if (commaSeparatedString) {
      xml += `\n    <${parentTag}>\n`;
      xml += commaSeparatedString
        .split(',')
        .map((a) => `      <${childTag}>${a.trim()}</${childTag}>\n`)
        .join('');
      xml += `    </${parentTag}>\n`;
    }
    return xml;
  }

  private getFileContent(title: string, authors: string, themes: string, comments: string): string {
    const authorsXml = this.createXmlNodeAndChildren('authors', 'author', authors);
    const themesXml = this.createXmlNodeAndChildren('themes', 'theme', themes);
    const commentsXml = this.createXmlNodeAndChildren('comments', 'comment', comments);

    const lyricsXml = '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.9"
      createdIn="LyricConverter ${packageFile.version}"
      modifiedIn="LyricConverter ${packageFile.version}"
      modifiedDate="${Utils.getIsoDateString()}">
  <properties>
    <titles>
      <title>${title}</title>
    </titles>${authorsXml}${themesXml}${commentsXml}
  </properties>
  <lyrics>
    ${lyricsXml}
  </lyrics>
</song>`;
  }
}
