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
  Title: string;
  SongNumber: string | null;
  Authors: Array<string>;
  LyricParts: Array<IMediaShoutLyricPart>;
}

export interface IMediaShoutLyricPart {
  Lyrics: string;
  PartType: number;
  PartTypeNumber: number;
  PartLabel: string | null;
  Guid: string;
}
