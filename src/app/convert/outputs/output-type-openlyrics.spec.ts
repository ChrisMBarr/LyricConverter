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
      `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.9"
      createdIn="LyricConverter 3.0.0"
      modifiedIn="LyricConverter 3.0.0"
      modifiedDate="2023-05-21T20:27:32">
  <properties>
    <titles>
      <title>Your Grace is Enough</title>
    </titles>
    <ccliNo>1234</ccliNo>
    <key>G</key>
    <authors>
      <author>Bethel Music</author>
    </authors>
  </properties>
  <lyrics>
    <verse name="Chorus">
      <lines>
        Your grace is enough<br/>
        Your grace is enough<br/>
        Your grace is enough for me
      </lines>
    </verse>
    <verse name="Verse 1">
      <lines>
        Great is your faithfulness O God<br/>
        You wrestle with the sinners heart<br/>
        You lead us by still waters and to mercy<br/>
        And nothing can keep us apart
      </lines>
    </verse>
    <verse name="Verse 2">
      <lines>
        Great is your love and justice God<br/>
        You use the weak to lead the strong<br/>
        You lead us in the song of your salvation<br/>
        And all your people sing along
      </lines>
    </verse>
  </lyrics>
</song>`
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
      `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.9"
      createdIn="LyricConverter 3.0.0"
      modifiedIn="LyricConverter 3.0.0"
      modifiedDate="2023-05-21T20:27:32">
  <properties>
    <titles>
      <title>At the Cross</title>
    </titles>
    <key>E</key>
    <authors>
      <author>Hymn</author>
    </authors>
    <comments>
      <comment>Words and Music by Randy & Terry Butler</comment>
    </comments>
  </properties>
  <lyrics>
    <verse name="Verse">
      <lines>
        I know a place<br/>
        A wonderful place<br/>
        Where accused and condemned<br/>
        Find mercy and grace<br/>
        Where the wrongs we have done<br/>
        And the wrongs done to us<br/>
        Were nailed there with him <br/>
        There on the cross
      </lines>
    </verse>
    <verse name="Chorus">
      <lines>
        At the cross<br/>
        He died for our sins<br/>
        At the cross <br/>
        He gave us life again
      </lines>
    </verse>
  </lyrics>
</song>`
    );

    expect(outputFile.songData).withContext('original song data').toEqual(song);
    expect(outputFile.fileName).withContext('file name').toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).withContext('file content').toEqual(normalizedExpectation);
  });
});
