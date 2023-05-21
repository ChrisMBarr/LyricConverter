export class TestUtils {
  public static dedent(inputStrings: TemplateStringsArray, ...values: any[]): string {
    //Convert template string arr into a real string
    const fullString = inputStrings.reduce(
      (accumulator, str, i) => `${accumulator}${values[i - 1]}${str}`
    );

    //on each line, remove any leading whitespace
    return fullString
      .split('\n')
      .map((line) => line.replace(/^[\t\s]*/, ''))
      .join('\n');
  }

  public static normalizeWhitespace(str: string): string {
    return str.replace(/\n\s+/g, '\n');
  }

  public static normalizeUuidAttributes(str: string): string {
    //Replace all instances of UUID identifiers in an XML string so the strings can be compared for testing
    //Example: `uuid="52598d09-555b-2ac8-acbd-665c108bff43"`

    return str.replace(/uuid="([a-z0-9-]+?)"/gi, `uuid="fake-uuid-for-testing"`);
  }

  public static normalizeDateAttribute(attrName: string, str: string): string {
    //Replace the single instance of a date value in an XML string so the strings can be compared for testing
    //Example: `lastDateUsed="2023-05-17T20:53:32"`

    return str.replace(
      new RegExp(`${attrName}="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}"`, 'i'),
      `${attrName}="2023-01-01T01:01:01"`
    );
  }

  public static normalizeProPresenterStringForTesting(str: string): string {
    //A helper method to do all of our replacements in one for comparing ProPresenter files
    return TestUtils.normalizeDateAttribute(
      'lastDateUsed',
      TestUtils.normalizeUuidAttributes(TestUtils.normalizeWhitespace(str))
    );
  }

  public static normalizeOpenLyricsStringForTesting(str: string): string {
    //A helper method to do all of our replacements in one for comparing OpenLyrics files
    return TestUtils.normalizeDateAttribute('modifiedDate', TestUtils.normalizeWhitespace(str));
  }

  public static deepClone<T>(input: T): T {
    return JSON.parse(JSON.stringify(input));
  }
}
