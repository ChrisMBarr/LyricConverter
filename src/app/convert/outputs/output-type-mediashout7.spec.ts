import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
import { TestUtils } from 'test/test-utils';

import { IMediaShoutRootDoc, MediaShoutPartTypeEnum } from '../models/mediashout.model';
import { OutputTypeMediaShout7 } from './output-type-mediashout7';

describe('OutputTypeMediaShout7', () => {
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
                  PartType: MediaShoutPartTypeEnum.Verse,
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

  it('should convert a song (1) to a MediaShout 7 file', () => {
    const song = structuredClone(mockSongObjects[0]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeMediaShoutStringForTesting(outputFile.outputContent);

    const expectedSongObj: IMediaShoutRootDoc = {
      Folders: [
        {
          Name: 'All',
          Lyrics: [
            {
              cclid: '1234',
              copyrights: [],
              Disclaimer: null,
              songId: '00000000-0000-0000-0000-000000000000',
              Title: 'Your Grace is Enough',
              SongNumber: null,
              Authors: ['Bethel Music'],
              LyricParts: [
                {
                  Lyrics: 'Your grace is enough\nYour grace is enough\nYour grace is enough for me',
                  PartType: MediaShoutPartTypeEnum.Chorus,
                  PartTypeNumber: 1,
                  PartLabel: null,
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics:
                    'Great is your faithfulness O God\nYou wrestle with the sinners heart\nYou lead us by still waters and to mercy\nAnd nothing can keep us apart',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: null,
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics:
                    'Great is your love and justice God\nYou use the weak to lead the strong\nYou lead us in the song of your salvation\nAnd all your people sing along',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 2,
                  PartLabel: null,
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

  it('should convert a song (2) to a MediaShout 7 file', () => {
    const song = structuredClone(mockSongObjects[1]!);
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
              Disclaimer: 'Words and Music by Randy & Terry Butler',
              songId: '00000000-0000-0000-0000-000000000000',
              Title: 'At the Cross',
              SongNumber: null,
              Authors: ['Hymn'],
              LyricParts: [
                {
                  Lyrics:
                    'I know a place\nA wonderful place\nWhere accused and condemned\nFind mercy and grace\nWhere the wrongs we have done\nAnd the wrongs done to us\nWere nailed there with him\nThere on the cross',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: null,
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'At the cross\nHe died for our sins\nAt the cross\nHe gave us life again',
                  PartType: MediaShoutPartTypeEnum.Chorus,
                  PartTypeNumber: 1,
                  PartLabel: null,
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

  it('should convert a song (3) to a MediaShout 7 file', () => {
    const song = structuredClone(mockSongObjects[2]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeMediaShoutStringForTesting(outputFile.outputContent);

    const expectedSongObj: IMediaShoutRootDoc = {
      Folders: [
        {
          Name: 'All',
          Lyrics: [
            {
              cclid: null,
              copyrights: ['Waiting Room Music', '2003'],
              Disclaimer: null,
              songId: '00000000-0000-0000-0000-000000000000',
              Title: 'Be Near',
              SongNumber: null,
              Authors: ['Shane Bernard'],
              LyricParts: [
                {
                  Lyrics: '',
                  PartType: MediaShoutPartTypeEnum.Blank,
                  PartTypeNumber: 1,
                  PartLabel: null,
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'You are all\nBig and small\nBeautiful',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: 'Verse 1',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: "And wonderful to\nTrust in grace\nThrough faith\nBut I'm asking to taste",
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 2,
                  PartLabel: 'Verse 1',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'For dark is light to You\nDepths are Height to you\nFar is near\nBut Lord I need to hear from You',
                  PartType: MediaShoutPartTypeEnum.Bridge,
                  PartTypeNumber: 1,
                  PartLabel: null,
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'Be near O God\nBe near O God of us\nYour nearness is\nTo us our good',
                  PartType: MediaShoutPartTypeEnum.Chorus,
                  PartTypeNumber: 1,
                  PartLabel: null,
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'Our Good',
                  PartType: MediaShoutPartTypeEnum.PreChorus,
                  PartTypeNumber: 1,
                  PartLabel: null,
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'Your fullness is mine\nRevelation Divine',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: 'Verse 2',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'But oh to taste\nTo know much\nMore than a page\nTo feel Your embrace',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 2,
                  PartLabel: 'Verse 2',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'My Good',
                  PartType: MediaShoutPartTypeEnum.Ending,
                  PartTypeNumber: 1,
                  PartLabel: null,
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: '',
                  PartType: MediaShoutPartTypeEnum.Blank,
                  PartTypeNumber: 1,
                  PartLabel: null,
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

  it('should convert a song (4) to a MediaShout 7 file', () => {
    const song = structuredClone(mockSongObjects[3]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeMediaShoutStringForTesting(outputFile.outputContent);

    const expectedSongObj: IMediaShoutRootDoc = {
      Folders: [
        {
          Name: 'All',
          Lyrics: [
            {
              cclid: '4639462',
              copyrights: ['public domain', '1779', 'Sparrow Records'],
              Disclaimer: 'This is one of the most popular songs in our congregation.',
              songId: '00000000-0000-0000-0000-000000000000',
              Title: 'Amazing Grace',
              SongNumber: null,
              Authors: ['John Newton', 'Chris Rice', 'Richard Wagner', 'František Foo'],
              LyricParts: [
                {
                  Lyrics: 'Amazing grace how sweet the sound that saved a wretch like me;\nA b c\nD e f',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: 'v1 (en)',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'Erstaunliche Ahmut, wie',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: 'v1 (de)',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'any comment\nLine content.',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: 'c',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics:
                    'any text\nAmazing grace how sweet the sound that saved a wretch like me;\nany text\nAmazing grace how sweet the sound that saved a wretch like me;\nAmazing grace how sweet the sound that saved a wretch like me;\nA b c\n\nD e f',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: 'v2 (en-US)',
                  Guid: '00000000-0000-0000-0000-000000000000',
                },
                {
                  Lyrics: 'This is text of ending.',
                  PartType: MediaShoutPartTypeEnum.Verse,
                  PartTypeNumber: 1,
                  PartLabel: 'e (de)',
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
