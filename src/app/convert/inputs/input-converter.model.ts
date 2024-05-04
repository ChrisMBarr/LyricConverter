import { IRawDataFile } from '../models/file.model';
import { ISong } from '../models/song.model';

export declare interface IInputConverter {
  /**
   * @description A unique name for the Input type. This should match the name of a corresponding Output type if it exists
   * @readonly
   */
  readonly name: string;
  /**
   * @description The primary file extension for this file type. This should match the fileExt of a corresponding Output type if it exists
   * @readonly
   */
  readonly fileExt: string;
  /**
   * @description A web address for the software or file format. This should match the url of a corresponding Output type if it exists
   * @readonly
   */
  readonly url?: string;
  /**
   * @description A test method to run against a file to detect the input type
   * @param rawFile
   * @returns {true} if the passed file matches for this type
   */
  doesInputFileMatchThisType: (rawFile: IRawDataFile) => boolean;
  /**
   * @description A method that will parse the input file and extract relevant data.
   * @param rawFile
   * @returns {ISong} which is a generic format to later be used by an output formatter
   */
  extractSongData: (rawFile: IRawDataFile) => ISong;
}
