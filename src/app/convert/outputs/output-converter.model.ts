import { IOutputFile } from '../models/file.model';
import { ISong } from '../models/song.model';

export declare interface IOutputConverter {
  /**
   * @description A unique name for the Output type which should match the name of a corresponding Input type if it exists
   * @readonly
   */
  readonly name: string;
  /**
   * @description The expected file extension for a file of this type. This will be used when creating output files of this type. This should match the fileExt of a corresponding Input type if it exists
   * @readonly
   */
  readonly fileExt?: string;
  /**
   * @description A web address for the software or file format. This should match the url of a corresponding Input type if it exists
   * @readonly
   */
  readonly url?: string;
  /**
   * @description Converts the song into the specified file format
   * @param song
   * @returns {IOutputFile}
   */
  convertToType: (song: ISong) => IOutputFile;
}
