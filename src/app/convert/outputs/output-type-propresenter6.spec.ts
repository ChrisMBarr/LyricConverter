import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
import { OutputTypeProPresenter6 } from './output-type-propresenter6';
import { TestUtils } from 'test/test-utils';

describe('OutputTypePropresenter6', () => {
  let outputType: OutputTypeProPresenter6;

  beforeEach(() => {
    outputType = new OutputTypeProPresenter6();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert a basic empty song to a ProPresenter 6 file', async () => {
    const song = structuredClone(mockEmptySong);
    const outputFile = outputType.convertToType(song);

    const emptySongFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v6 - empty-song.pro6');

    const normalizedOutput = TestUtils.normalizeProPresenterStringForTesting(outputFile.outputContent);
    const normalizedExpectation = TestUtils.normalizeProPresenterStringForTesting(emptySongFile.dataAsString);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });

  it('should convert a song to a ProPresenter 6 file', async () => {
    const song = structuredClone(mockSongObjects[2]!);
    const outputFile = outputType.convertToType(song);

    const songFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v6 - Be Near (2).pro6');

    const normalizedOutput = TestUtils.normalizeProPresenterStringForTesting(outputFile.outputContent);
    const normalizedExpectation = TestUtils.normalizeProPresenterStringForTesting(songFile.dataAsString);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });
});
