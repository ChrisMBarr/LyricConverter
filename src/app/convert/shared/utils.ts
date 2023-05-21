interface IRtfColor {
  r: number;
  g: number;
  b: number;
}

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

  public static formatRtf(
    text: string,
    font = 'Arial',
    color: IRtfColor = { r: 255, g: 255, b: 255 }
  ): string {
    //Text will be centered, white, 60pt
    return `{\\rtf1\\ansi\\ansicpg1252\\cocoartf1038\\cocoasubrtf320',
{\\fonttbl\\f0\\fswiss\\fcharset0 ${font};}
{\\colortbl;\\red${color.r}\\green${color.g}\\blue${color.b};}
\\pard\\tx560\\tx1120\\tx1680\\tx2240\\tx2800\\tx3360\\tx3920\\tx4480\\tx5040\\tx5600\\tx6160\\tx6720\\qc\\pardirnatural

\\f0\\fs120 \\cf1 \\\r${text.replace(/\r|\n/g, '\\\r')}}`;
  }

  public static getIsoDateString(): string{
    //Remove the ending milliseconds: '2023-05-17T16:02:23.245Z' --> '2023-05-17T16:02:23'
    return new Date().toISOString().replace(/\.\d{3}Z$/, '')
  }

  //https://stackoverflow.com/a/41919138/79677
  public static mergeArraysByProp<T>(a: T[], b: T[], propName: string): T[] {
    // We need to ignore the TS compile error since there's no good way to write a typedef for this!
    // @ts-expect-error
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const reduced = a.filter((aItem) => !b.find((bItem) => aItem[propName] === bItem[propName]));
    return reduced.concat(b);
  }
}
