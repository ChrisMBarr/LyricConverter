import { TestUtils } from 'test/test-utils';
import { OutputTypeLyricConverter } from './output-type-lyric-converter';
import { mockSongObjects } from 'test/mock-song-objects';

describe('OutputTypeLyricConverter', () => {
  let outputType: OutputTypeLyricConverter;

  beforeEach(() => {
    outputType = new OutputTypeLyricConverter();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should output a JSON object identical to the input, but without the filename property', () => {
    const song = TestUtils.deepClone(mockSongObjects[0]!);

    const expectedJsonString = JSON.stringify(
      { title: song.title, info: song.info, slides: song.slides },
      null,
      2
    );

    expect(outputType.convertToType(song)).toEqual({
      songData: song,
      fileName: `${song.fileName}.${outputType.fileExt}`,
      outputContent: expectedJsonString,
    });
  });
});
