import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
import { TestUtils } from 'test/test-utils';

import { OutputTypeProPresenter5 } from './output-type-propresenter5';

describe('OutputTypePropresenter5', () => {
  let outputType: OutputTypeProPresenter5;

  beforeEach(() => {
    outputType = new OutputTypeProPresenter5();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert a basic empty song to a ProPresenter 5 file', async () => {
    const song = structuredClone(mockEmptySong);
    const outputFile = outputType.convertToType(song);

    const emptySongFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - empty-song.pro5');

    const normalizedOutput = TestUtils.normalizeProPresenterStringForTesting(outputFile.outputContent);
    const normalizedExpectation = TestUtils.normalizeProPresenterStringForTesting(emptySongFile.dataAsString);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.originalFile.name}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });

  it('should convert a song to a ProPresenter 5 file', async () => {
    const song = structuredClone(mockSongObjects[2]!);
    const outputFile = outputType.convertToType(song);

    const songFile = await TestUtils.loadTestFileAsRawDataFile('ProPresenter', 'v5 - Be Near (2).pro5');

    const normalizedOutput = TestUtils.normalizeProPresenterStringForTesting(outputFile.outputContent);
    const normalizedExpectation = TestUtils.normalizeProPresenterStringForTesting(songFile.dataAsString);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.originalFile.name}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });
});
