export interface ISong {
  fileName: string;
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
