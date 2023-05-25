import { ISong } from "./song.model";

//Similar to File, but with some custom props & missing prototypes we don't need
export interface IFileWithData {
  lastModified: number;
  size: number;
  type: string;
  name: string;
  nameWithoutExt: string;
  ext: string;
  data: string;
}

export interface IRawDataFile {
  name: string;
  ext: string;
  type: string;
  data: string;
}

export interface IOutputFile {
  songData: ISong;
  fileName: string,
  outputContent: string;
}
