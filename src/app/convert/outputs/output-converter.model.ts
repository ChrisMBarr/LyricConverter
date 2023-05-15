import { IOutputFile } from "../models/file.model";
import { ISong } from "../models/song.model";

export declare interface IOutputConverter {
  friendlyName: string;
  friendlyFileExt?: string;
  convertToType: (song: ISong) => IOutputFile;
}
