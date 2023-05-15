export function dedent(inputStrings: TemplateStringsArray, ...values: any[]) {
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
