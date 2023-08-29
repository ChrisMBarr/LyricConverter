import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
import { TestUtils } from 'test/test-utils';
import { OutputTypeProPresenter5 } from './output-type-propresenter5';
import { pp5File4, pp5FileEmptySong } from 'test/mock-propresenter-files';

describe('OutputTypePropresenter5', () => {
  let outputType: OutputTypeProPresenter5;

  beforeEach(() => {
    outputType = new OutputTypeProPresenter5();
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
      pp5FileEmptySong.dataAsString
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
      pp5File4.dataAsString
    );

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });
});
