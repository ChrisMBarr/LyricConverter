export interface ISongError {
  /**
   * @description A friendly error message to show in the UI
   */
  message: string;

  /**
   * @description The file name that might be associated with this error
   */
  fileName?: string;

  /**
   * @description If this is a caught error message, pass along the real error here
   */
  thrownError?: unknown;
}
