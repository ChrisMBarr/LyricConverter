import { IRawDataFile } from "src/app/shared/file.model";
import { ISong } from "src/app/shared/song.model";

export interface IFormat {
  friendlyName: string;
  friendlyFileExt: string;
  testFormat: (f: IRawDataFile) => boolean;
  convert: (rawFile: IRawDataFile) => ISong; //TODO: Use something better than string[] later
}
