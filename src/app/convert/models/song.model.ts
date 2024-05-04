export interface ISong {
  lyricConverterVersion: string;
  timestamp: string;
  originalFile: {
    extension: string;
    format: string;
    name: string;
  };
  title: string;
  info: Array<ISongInfo>;
  slides: Array<ISongSlide>;
}

export interface ISongSlide {
  title: string;
  lyrics: string;
}

export interface ISongInfo {
  name: string;
  value: string | number;
}
