export interface IMediaShoutRootDoc {
  Folders: Array<IMediaShoutFolder>;
}

export interface IMediaShoutFolder {
  Name: string;
  Lyrics: Array<IMediaShoutLyrics>;
}

export interface IMediaShoutLyrics {
  cclid: string | null;
  Disclaimer: string | null;
  copyrights: Array<string>;
  songId: string;
  Title: string | null;
  SongNumber: string | null;
  Authors: Array<string>;
  LyricParts: Array<IMediaShoutLyricPart>;
}

export interface IMediaShoutLyricPart {
  Lyrics: string;
  PartType: MediaShoutPartTypeEnum;
  PartTypeNumber: number;
  PartLabel: string | null;
  Guid: string;
}

export enum MediaShoutPartTypeEnum {
  Verse = 0,
  Chorus = 1,
  Bridge = 2,
  Ending = 3,
  Blank = 4,
  Intro = 5,
  PreChorus = 6,
  AltEnding = 7,
  Tag = 8,
  Refrain = 9,
  Reprise = 10,
  Reading = 11,
  Interlude = 12,
  Misc = 13,
  Vamp = 14,
}
