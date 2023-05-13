import { IRawDataFile } from 'src/app/shared/file.model';
import { IFormat } from './format.model';

export class FormatProPresenter implements IFormat {
  name = 'ProPresenter';

  testFormat = (rawFile: IRawDataFile): boolean => {
    return /^pro\d$/.test(rawFile.ext);
  };

  convert = (rawFile: IRawDataFile): string[] => {
    return [rawFile.data];
  };
}
