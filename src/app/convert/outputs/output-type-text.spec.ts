import { OutputTypeText } from './output-type-text';

describe('OutputTypeText', () => {
  let outputType: OutputTypeText;

  beforeEach(() => {
    outputType = new OutputTypeText();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });
});
