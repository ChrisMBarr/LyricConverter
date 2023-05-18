import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
import { TestUtils } from 'test/test-utils';
import { OutputTypeProPresenter } from './output-type-propresenter';
import { pp5File4, pp5FileEmptySong } from 'test/mock-propresenter-files';

describe('OutputTypePropresenter', () => {
  let outputType: OutputTypeProPresenter;

  beforeEach(() => {
    outputType = new OutputTypeProPresenter();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert a basic empty song to a ProPresenter 5 file', () => {
    const song = TestUtils.deepClone(mockEmptySong);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeProPresenterStringForTesting(
      outputFile.outputContent
    );
    const normalizedExpectation = TestUtils.normalizeProPresenterStringForTesting(
      pp5FileEmptySong.data
    );

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });

  it('should convert a song to a ProPresenter 5 file', () => {
    const song = TestUtils.deepClone(mockSongObjects[2]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeProPresenterStringForTesting(
      outputFile.outputContent
    );
    const normalizedExpectation = TestUtils.normalizeProPresenterStringForTesting(
      pp5File4.data
    );

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });
});
