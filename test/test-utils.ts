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

  public static deepClone<T>(input: T): T {
    return JSON.parse(JSON.stringify(input));
  }
}
