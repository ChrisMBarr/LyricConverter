/* eslint-disable @typescript-eslint/naming-convention */

//A representation of an OpenLyrics document as a JSON object parsed by fast-xml-parser
//OpenLyrics Format Docs: https://docs.openlyrics.org/en/latest/dataformat.html
//The below data model relies on the following options being set:
//  { ignoreAttributes: false, attributeNamePrefix: '', parseAttributeValue: true, ignoreDeclaration: true, }
//  All options here: https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/docs/v4/2.XMLparseOptions.md

export interface IOpenLyricsDocRoot {
  '?xml-stylesheet': {
    href: string;
    type: string;
  };
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
  [key: string]: any;
  //Lots of properties can exist here, so only the bigger & more common objects will be described
  titles?: IOpenLyricsDocTitles;
  authors?: IOpenLyricsDocAuthors;
  comments?: IOpenLyricsDocComments;
  songbooks?: IOpenLyricsDocSongBooks;
  tempo?: IOpenLyricsDocTempo;
  themes?: IOpenLyricsDocThemes;
}

export interface IOpenLyricsDocTitles {
  title: (string | { '#text': string; lang?: string })[];
}
export interface IOpenLyricsDocAuthors {
  author: (string | { '#text': string; lang?: string; type?: string })[];
}
export interface IOpenLyricsDocComments {
  comment: (string | { '#text': string })[];
}
export interface IOpenLyricsDocSongBooks {
  songbook: { name: string; entry?: string | number }[];
}
export interface IOpenLyricsDocThemes {
  theme: (string | { '#text': string; lang?: string })[];
}
export interface IOpenLyricsDocTempo {
  '#text': string;
  type: string;
}
export interface IOpenLyricsDocLyrics {
  verse?: IOpenLyricsDocVerse[];
}
export interface IOpenLyricsDocVerse {
  lines: (string | { '#text': string; part?: string; repeat?: number })[];
  name: string;
  lang?: string;
  translit?: string;
}
