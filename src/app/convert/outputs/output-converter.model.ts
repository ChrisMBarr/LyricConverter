import { IOutputFile } from "../models/file.model";
import { ISong } from "../models/song.model";

export declare interface IOutputConverter {
  readonly friendlyName: string;
  readonly friendlyFileExt?: string;
  convertToType: (song: ISong) => IOutputFile;
}
