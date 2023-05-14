import { IRawDataFile } from 'src/app/shared/file.model';
import { FormatProPresenter } from './format-propresenter';

describe('FormatProPresenter', () => {
  let formatter: FormatProPresenter;

  beforeEach(() => {
    formatter = new FormatProPresenter();
  });

  it('should create an instance', () => {
    expect(formatter).toBeTruthy();
  });

  it('should properly accept a ProPresenter 4 file when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'pro4',
      type:'',
      data: '<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0"></RVPresentationDocument>'
    }
    expect(formatter.testFormat(testFile)).toBeTrue();
  });

  it('should properly accept a ProPresenter 5 file when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'pro5',
      type:'',
      data: '<RVPresentationDocument height="768" width="1024" versionNumber="500" docType="0"></RVPresentationDocument>'
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

  it('should properly reject plain text files when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'txt',
      type:'text/plain',
      data: 'this is some plain text'
    }
    expect(formatter.testFormat(testFile)).toBeFalse();
  });


});
