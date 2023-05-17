import { mockSongObjects } from 'test/mock-song-objects';
import { TestUtils } from 'test/test-utils';
import { OutputTypePropresenter } from './output-type-propresenter';

describe('OutputTypePropresenter', () => {
  let outputType: OutputTypePropresenter;

  beforeEach(() => {
    outputType = new OutputTypePropresenter();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  xit('should convert a song to a ProPresenter file', () => {
    const song = TestUtils.deepClone(mockSongObjects[0]!);

    expect(outputType.convertToType(song)).toEqual({
      songData: song,
      fileName: `${song.fileName}.${outputType.fileExt}`,
      outputContent: TestUtils.dedent``,
    });
  });
});
