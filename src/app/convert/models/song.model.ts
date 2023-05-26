export interface ISong {
  fileName: string;
  title: string;
  info: ISongInfo[];
  slides: ISongSlide[];
}

export interface ISongSlide {
  title: string;
  lyrics: string;
}

export interface ISongInfo {
  name: string;
  value: string | number;
}
