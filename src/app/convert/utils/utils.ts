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

  //https://stackoverflow.com/a/41919138/79677
  public static mergeArraysByProp<T>(a: T[], b: T[], propName: string): T[] {
    // We need to ignore the TS compile error since there's no good way to write a typedef for this!
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const reduced = a.filter((aItem) => !b.find((bItem) => aItem[propName] === bItem[propName]));
    return reduced.concat(b);
  }
}
