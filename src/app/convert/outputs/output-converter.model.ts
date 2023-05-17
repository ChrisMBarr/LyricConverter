import { IOutputFile } from "../models/file.model";
import { ISong } from "../models/song.model";

export declare interface IOutputConverter {
  /**
   * @description A unique name for the Output type which should match the name of a corresponding Input type if it exists
   * @readonly
   */
  readonly name: string;
  /**
   * @description The expected file extension for a file of this type. This will be used when creating output files of this type
   * @readonly
   */
  readonly fileExt?: string;
  /**
   * @description The expected file extension for a file of this type. This will be used when creating output files of this type
   * @param song
   * @returns {IOutputFile}
   */
  convertToType(song: ISong): IOutputFile;
}
