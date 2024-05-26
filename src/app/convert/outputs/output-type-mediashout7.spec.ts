import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
import { TestUtils } from 'test/test-utils';

import { IMediaShoutRootDoc } from '../models/mediashout.model';
import { OutputTypeMediaShout7 } from './output-type-mediashout7';

fdescribe('OutputTypeMediaShout7', () => {
  let outputType: OutputTypeMediaShout7;

  beforeEach(() => {
    outputType = new OutputTypeMediaShout7();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert an empty song to an empty MediaShout file', () => {
    const song = structuredClone(mockEmptySong);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeMediaShoutStringForTesting(outputFile.outputContent);

    const expectedSongObj: IMediaShoutRootDoc = {
      Folders: [
        {
          Name: 'All',
          Lyrics: [
            {
              cclid: null,
              copyrights: [],
              Disclaimer: null,
              songId: '00000000-0000-0000-0000-000000000000',
              Title: 'Empty Title',
              SongNumber: null,
              Authors: [],
              LyricParts: [
                {
                  Lyrics: '',
                  PartType: 0,
                  PartTypeNumber: 1,
                  PartLabel: 'Empty Slide',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
              ],
            },
          ],
        },
      ],
    };

    const normalizedExpectation = TestUtils.normalizeMediaShoutStringForTesting(JSON.stringify(expectedSongObj, null, 2));

    expect(outputFile.songData).withContext('original song data').toEqual(song);
    expect(outputFile.fileName).withContext('file name').toEqual(`${song.originalFile.name}.${outputType.fileExt}`);
    expect(normalizedOutput).withContext('file content').toEqual(normalizedExpectation);
  });
});
