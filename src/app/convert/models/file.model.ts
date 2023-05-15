//Similar to File, but with some custom props & missing prototypes we don't need
export interface IFileWithData {
  lastModified: number;
  size: number;
  type: string;
  name: string;
  nameWithoutExt: string;
  ext: string;
  data: string | ArrayBuffer | null | undefined;
}

export interface IRawDataFile {
  name: string;
  ext: string;
  type: string;
  data: string;
}
