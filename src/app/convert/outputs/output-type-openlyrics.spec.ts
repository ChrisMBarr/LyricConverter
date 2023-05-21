import { TestUtils } from 'test/test-utils';
import { OutputTypeOpenLyrics } from './output-type-openlyrics';
import { mockSongObjects } from 'test/mock-song-objects';

describe('OutputTypeOpenLyrics', () => {
  let outputType: OutputTypeOpenLyrics;

  beforeEach(() => {
    outputType = new OutputTypeOpenLyrics();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert a song (1) to a OpenLyrics XML file', () => {
    const song = TestUtils.deepClone(mockSongObjects[0]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeOpenLyricsStringForTesting(
      outputFile.outputContent
    );

    const normalizedExpectation = TestUtils.normalizeOpenLyricsStringForTesting(
      `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>\n<song xmlns="http://openlyrics.info/namespace/2009/song"\n      version="0.9"\n      createdIn="LyricConverter 3.0.0"\n      modifiedIn="LyricConverter 3.0.0"\n      modifiedDate="2023-05-21T18:19:52">\n  <properties>\n    <titles>\n      <title>Your Grace is Enough</title>\n    </titles>\n    <ccliNo>1234</ccliNo>\n\n    <key>G</key>\n<authors>\n      <author>Bethel Music</author>\n</authors>\n\n  </properties>\n  <lyrics>\n    \n  </lyrics>\n</song>`
    );

    expect(outputFile.songData).withContext('original song data').toEqual(song);
    expect(outputFile.fileName).withContext('file name').toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).withContext('file content').toEqual(normalizedExpectation);
  });

  it('should convert a song (2) to a OpenLyrics XML file', () => {
    const song = TestUtils.deepClone(mockSongObjects[1]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeOpenLyricsStringForTesting(
      outputFile.outputContent
    );

    const normalizedExpectation = TestUtils.normalizeOpenLyricsStringForTesting(
      `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>\n<song xmlns="http://openlyrics.info/namespace/2009/song"\n      version="0.9"\n      createdIn="LyricConverter 3.0.0"\n      modifiedIn="LyricConverter 3.0.0"\n      modifiedDate="2023-05-21T19:01:06">\n  <properties>\n    <titles>\n      <title>At the Cross</title>\n    </titles>\n    <key>E</key>\n<authors>\n      <author>Hymn</author>\n</authors>\n<comments>\n      <comment>Words and Music by Randy & Terry Butler</comment>\n</comments>\n\n  </properties>\n  <lyrics>\n    \n  </lyrics>\n</song>`
    );

    expect(outputFile.songData).withContext('original song data').toEqual(song);
    expect(outputFile.fileName).withContext('file name').toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).withContext('file content').toEqual(normalizedExpectation);
  });
});
