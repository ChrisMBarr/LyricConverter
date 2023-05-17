import { mockSongObjects } from 'test/mock-song-objects';
import { TestUtils } from 'test/test-utils';
import { OutputTypeProPresenter } from './output-type-propresenter';

describe('OutputTypePropresenter', () => {
  let outputType: OutputTypeProPresenter;

  beforeEach(() => {
    outputType = new OutputTypeProPresenter();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  xit('should convert a song to a ProPresenter file', () => {
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