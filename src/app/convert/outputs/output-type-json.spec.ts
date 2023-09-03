import { OutputTypeJSON } from './output-type-json';
import { mockSongObjects } from 'test/mock-song-objects';

describe('OutputTypeJSON', () => {
  let outputType: OutputTypeJSON;

  beforeEach(() => {
    outputType = new OutputTypeJSON();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should output a JSON object identical to the input, but without the filename property', () => {
    const song = structuredClone(mockSongObjects[0]!);

    const expectedJsonString = JSON.stringify({ title: song.title, info: song.info, slides: song.slides }, null, 2);

    expect(outputType.convertToType(song)).toEqual({
      songData: song,
      fileName: `${song.fileName}.${outputType.fileExt}`,
      outputContent: expectedJsonString,
    });
  });
});
