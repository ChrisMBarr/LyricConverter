import { IRawDataFile } from 'src/app/shared/file.model';
import { FormatText } from './format-text';

describe('FormatText', () => {
  let formatter: FormatText;

  beforeEach(() => {
    formatter = new FormatText();
  });

  it('should create an instance', () => {
    expect(formatter).toBeTruthy();
  });

  it('should properly accept plain text files when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'txt',
      type:'text/plain',
      data: 'this is some plain text'
    }
    expect(formatter.testFormat(testFile)).toBeTrue();
  });

  it('should properly reject a JSON file when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'json',
      type:'text/json',
      data: '{}'
    }
    expect(formatter.testFormat(testFile)).toBeFalse();
  });

  it('should properly reject a ProPresenter file when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'pro5',
      type:'',
      data: '<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0"></RVPresentationDocument>'
    }
    expect(formatter.testFormat(testFile)).toBeFalse();
  });
});
