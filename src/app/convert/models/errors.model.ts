import { CUSTOM_ERROR_IDENTIFIER } from '../shared/constants';

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

/**
 * @description A custom error type to throw when a known error is triggered. This way we can show a specific error message instead of a generic or overly technical message
 */
export class LyricConverterError extends Error {
  constructor(message: string) {
    super();
    return new Error(message, { cause: CUSTOM_ERROR_IDENTIFIER });
  }
}
