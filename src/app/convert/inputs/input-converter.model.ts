import { IRawDataFile } from "src/app/convert/models/file.model";
import { ISong } from "src/app/convert/models/song.model";

export declare interface IInputConverter {
  /**
   * @description A unique ID for the input type which should be written in kebab-case
   */
  readonly name: string;
  /**
   * @description The expected file extension for a file of this type
   */
  readonly fileExt: string;
  /**
   * @description A test method to run against a file to detect the input type
   * @returns {true} if the passed file matches for this type
   */
  doesInputFileMatchThisType: (f: IRawDataFile) => boolean;
  /**
   * @description A method that will parse the input file and extract relevant data.
   * @returns {ISong} which is a generic format to later be used by an output formatter
   */
  extractSongData: (rawFile: IRawDataFile) => ISong;
}
