import { IOutputFile } from '../src/app/convert/models/file.model';
import { mockSongObjects } from './mock-song-objects';

export const mockOutputFiles: IOutputFile[] = [
  {
    songData: mockSongObjects[0]!,
    file: new File([], ''),
  },
  {
    songData: mockSongObjects[1]!,
    file: new File([], ''),
  },
];
