//A representation of an OpenLyrics document as a JSON object parsed by fast-xml-parser
//OpenLyrics Format Docs: https://docs.openlyrics.org/en/latest/dataformat.html
//The below data model relies on the following options being set:
//  { ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: true, ignoreDeclaration: true, }
//  All options here: https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md

export interface IOpenLyricsDocRoot {
  "?xml-stylesheet": {
    href: string;
    type: string;
  }
  song: IOpenLyricsDocSong;
}
export interface IOpenLyricsDocSong {
  properties: IOpenLyricsDocProperties;
  lyrics: IOpenLyricsDocLyrics;
  xmlns: string;
  version: number;
  createdIn: string;
  modifiedIn: string;
  modifiedDate: string;
}
export interface IOpenLyricsDocProperties {
  titles: IOpenLyricsDocTitles;
}
export interface IOpenLyricsDocTitles {
  title: string[];
}
export interface IOpenLyricsDocLyrics {
  verse: IOpenLyricsDocVerse[];
}
export interface IOpenLyricsDocVerse {
  lines: string[];
  name: string;
  lang?: string;
}
