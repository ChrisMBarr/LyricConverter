export class Utils {
  public static normalizeLineEndings(inputStr: string): string{
    //replace all adjacent \n\r or \r\n characters with just \n to simplify
    return inputStr.replace(/(\r\n)|(\n\r)/g, '\n')
  }

  //https://stackoverflow.com/a/41919138/79677
  public static mergeArraysByProp<T>(a: T[], b: T[], propName: string): T[] {
    // @ts-expect-error - We need to ignore the TS compile error since there's no good way to write a typedef for this!
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const reduced = a.filter((aItem) => !b.find((bItem) => aItem[propName] === bItem[propName]));
    return reduced.concat(b);
  }
}
