import { IRawDataFile } from "src/app/convert/models/file.model";
import { ISong } from "src/app/convert/models/song.model";

export declare interface IInputConverter {
  /**
   * @description A unique name for the input type which should match the name of a corresponding Output type if it exists
   * @readonly
   */
  readonly name: string;
  /**
   * @description A test method to run against a file to detect the input type
   * @param rawFile
   * @returns {true} if the passed file matches for this type
   */
  doesInputFileMatchThisType(file: IRawDataFile): boolean;
  /**
   * @description A method that will parse the input file and extract relevant data.
   * @param rawFile
   * @returns {ISong} which is a generic format to later be used by an output formatter
   */
  extractSongData(rawFile: IRawDataFile): ISong;
}
