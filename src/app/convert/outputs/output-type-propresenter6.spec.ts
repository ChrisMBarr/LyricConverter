import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
import { TestUtils } from 'test/test-utils';
import { OutputTypeProPresenter6 } from './output-type-propresenter6';
import { pp6File5, pp6FileEmptySong } from 'test/mock-propresenter-files';

describe('OutputTypePropresenter6', () => {
  let outputType: OutputTypeProPresenter6;

  beforeEach(() => {
    outputType = new OutputTypeProPresenter6();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert a basic empty song to a ProPresenter 6 file', () => {
    const song = TestUtils.deepClone(mockEmptySong);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeProPresenterStringForTesting(
      outputFile.outputContent
    );
    const normalizedExpectation = TestUtils.normalizeProPresenterStringForTesting(
      pp6FileEmptySong.dataAsString
    );

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });

  it('should convert a song to a ProPresenter 6 file', () => {
    const song = TestUtils.deepClone(mockSongObjects[2]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeProPresenterStringForTesting(
      outputFile.outputContent
    );
    const normalizedExpectation = TestUtils.normalizeProPresenterStringForTesting(
      pp6File5.dataAsString
    );

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });
});
