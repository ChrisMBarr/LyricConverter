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

  xit('should convert a song to a OpenLyrics XML file', () => {
    const song = TestUtils.deepClone(mockSongObjects[0]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeDateAttribute(
      outputFile.outputContent,
      'modifiedDate'
    );

    const normalizedExpectation = TestUtils.normalizeDateAttribute(
      `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>\n<song xmlns="http://openlyrics.info/namespace/2009/song"\n      version="0.9"\n      createdIn="LyricConverter 3.0.0"\n      modifiedIn="LyricConverter 3.0.0"\n      modifiedDate="2023-05-21T05:08:14">\n  <properties>\n    <titles>\n      <title>Your Grace is Enough</title>\n    </titles>\n  </properties>\n  <lyrics>\n    \n  </lyrics>\n</song>`,
      'modifiedDate'
    );

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).toEqual(normalizedExpectation);
  });
});
