import { IRawDataFile } from "src/app/shared/file.model";

export interface IFormat {
  name: string;
  testFormat: (rawFile: IRawDataFile) => boolean;
  convert: (rawFile: IRawDataFile) => string[]; //TODO: Use something better than string[] later
}
