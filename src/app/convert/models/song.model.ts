export interface ISong {
  lyricConverterVersion: string;
  timestamp: string;

  /**@description Information about the original file that was input */
  originalFile: {
    extension: string;
    format: string;
    name: string;
  };

  /**@description The output file name. This is useful for situations where an input file contains multiple songs, which will generate multiple output files */
  outputFileName: string;

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
