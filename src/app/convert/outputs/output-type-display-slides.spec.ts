import { mockSongObjects } from 'test/mock-song-objects';
import { OutputTypeDisplaySlides } from './output-type-display-slides';

describe('OutputTypeDisplaySlides', () => {
  let outputType: OutputTypeDisplaySlides;

  beforeEach(() => {
    outputType = new OutputTypeDisplaySlides();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should return an identical input object on the output object', () => {
    const song = mockSongObjects[0]!;
    expect(outputType.convertToType(song)).toEqual({ songData: song, file: new File([], '') });
  });
});
