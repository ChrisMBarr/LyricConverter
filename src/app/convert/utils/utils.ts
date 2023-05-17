export class Utils {
  public static decodeBase64(base64Str: string): string {
    return window.atob(base64Str);
  }

  public static encodeBase64(str: string): string {
    return window.btoa(str);
  }

  public static stripRtf(str: string): string {
    const basicRtfPattern = /\{\*?\\[^{}]+;}|[{}]|\\[A-Za-z]+\n?(?:-?\d+)?[ ]?/g;
    const newLineSlashesPattern = /\\\n/g;
    const ctrlCharPattern = /\n\\f[0-9]\s/g;

    //Remove RTF Formatting, replace RTF new lines with real line breaks, and remove whitespace
    return str
      .replace(ctrlCharPattern, '')
      .replace(basicRtfPattern, '')
      .replace(newLineSlashesPattern, '\n')
      .trim();
  }

  //This rule is OK to disable here since we truly do not know what it could be used for
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static mergeObjects<T>(destination: any, source: any): T {
    //https://stackoverflow.com/a/171258/79677
    for (const property in source) {
      destination[property] = source[property];
    }
    return destination;
  }
}
