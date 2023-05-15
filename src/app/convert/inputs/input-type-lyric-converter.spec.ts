import { IRawDataFile } from 'src/app/convert/models/file.model';
import { InputTypeLyricConverter } from './input-type-lyric-converter';

describe('InputTypeLyricConverter', () => {
  let inputConverter: InputTypeLyricConverter;

  beforeEach(() => {
    inputConverter = new InputTypeLyricConverter();
  });

  it('should create an instance', () => {
    expect(inputConverter).toBeTruthy();
  });

  it('should properly accept LyricConverter JSON files when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'json',
      type:'text/json',
      data: '{}'
    }
    expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeTrue();
  });

  it('should properly reject plain text files when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'txt',
      type:'text/plain',
      data: 'this is some plain text'
    }
    expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
  });

  it('should properly reject a ProPresenter file when tested', () => {
    const testFile: IRawDataFile = {
      name: 'foo',
      ext: 'pro5',
      type:'',
      data: '<RVPresentationDocument height="768" width="1024" versionNumber="400" docType="0"></RVPresentationDocument>'
    }
    expect(inputConverter.doesInputFileMatchThisType(testFile)).toBeFalse();
  });
});
