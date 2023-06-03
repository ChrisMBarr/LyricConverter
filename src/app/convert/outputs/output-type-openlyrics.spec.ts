import { TestUtils } from 'test/test-utils';
import { OutputTypeOpenLyrics } from './output-type-openlyrics';
import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
const packageFile = require('/package.json');

describe('OutputTypeOpenLyrics', () => {
  let outputType: OutputTypeOpenLyrics;

  beforeEach(() => {
    outputType = new OutputTypeOpenLyrics();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert an empty song to an empty OpenLyrics XML file', () => {
    const song = TestUtils.deepClone(mockEmptySong);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeOpenLyricsStringForTesting(
      outputFile.outputContent
    );

    const normalizedExpectation = TestUtils.normalizeOpenLyricsStringForTesting(
      `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.9"
      createdIn="LyricConverter ${packageFile.version}"
      modifiedIn="LyricConverter ${packageFile.version}"
      modifiedDate="2023-05-21T20:27:32">
  <properties>
    <titles>
      <title>Empty Title</title>
    </titles>
  </properties>
  <lyrics>
  </lyrics>
</song>`
    );

    expect(outputFile.songData).withContext('original song data').toEqual(song);
    expect(outputFile.fileName).withContext('file name').toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).withContext('file content').toEqual(normalizedExpectation);
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
      createdIn="LyricConverter ${packageFile.version}"
      modifiedIn="LyricConverter ${packageFile.version}"
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
      createdIn="LyricConverter ${packageFile.version}"
      modifiedIn="LyricConverter ${packageFile.version}"
      modifiedDate="2023-05-21T20:27:32">
  <properties>
    <titles>
      <title>At the Cross</title>
    </titles>
    <key>E</key>
    <authors>
      <author>Hymn</author>
    </authors>
    <tempo type="text">Moderate</tempo>
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
        Were nailed there with him<br/>
        There on the cross
      </lines>
    </verse>
    <verse name="Chorus">
      <lines>
        At the cross<br/>
        He died for our sins<br/>
        At the cross<br/>
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

  it('should convert a song (3) to a OpenLyrics XML file', () => {
    const song = TestUtils.deepClone(mockSongObjects[2]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeOpenLyricsStringForTesting(
      outputFile.outputContent
    );

    const normalizedExpectation = TestUtils.normalizeOpenLyricsStringForTesting(
      `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.9"
      createdIn="LyricConverter ${packageFile.version}"
      modifiedIn="LyricConverter ${packageFile.version}"
      modifiedDate="2023-05-21T20:40:24">
  <properties>
    <titles>
      <title>Be Near</title>
    </titles>
    <copyright>2003</copyright>
    <keywords>Grace, Peace, Nearness</keywords>
    <timeSignature>3/4</timeSignature>
    <authors>
      <author>Shane Bernard</author>
    </authors>
  </properties>
  <lyrics>
    <verse name="Verse 1 (1)">
      <lines>
        You are all<br/>
        Big and small<br/>
        Beautiful
      </lines>
    </verse>
    <verse name="Verse 1 (2)">
      <lines>
        And wonderful to<br/>
        Trust in grace<br/>
        Through faith<br/>
        But I'm asking to taste
      </lines>
    </verse>
    <verse name="Bridge 1">
      <lines>
        For dark is light to You<br/>
        Depths are Height to you<br/>
        Far is near<br/>
        But Lord I need to hear from You
      </lines>
    </verse>
    <verse name="Chorus">
      <lines>
        Be near O God<br/>
        Be near O God of us<br/>
        Your nearness is<br/>
        To us our good
      </lines>
    </verse>
    <verse name="Post-Chorus">
      <lines>
        Our Good
      </lines>
    </verse>
    <verse name="Verse 2 (1)">
      <lines>
        Your fullness is mine<br/>
        Revelation Divine
      </lines>
    </verse>
    <verse name="Verse 2 (2)">
      <lines>
        But oh to taste<br/>
        To know much<br/>
        More than a page<br/>
        To feel Your embrace
      </lines>
    </verse>
    <verse name="Ending">
      <lines>
        My Good
      </lines>
    </verse>
  </lyrics>
</song>`
    );

    expect(outputFile.songData).withContext('original song data').toEqual(song);
    expect(outputFile.fileName).withContext('file name').toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(normalizedOutput).withContext('file content').toEqual(normalizedExpectation);
  });

  it('should convert a song (4) to a OpenLyrics XML file', () => {
    const song = TestUtils.deepClone(mockSongObjects[3]!);
    const outputFile = outputType.convertToType(song);

    const normalizedOutput = TestUtils.normalizeOpenLyricsStringForTesting(
      outputFile.outputContent
    );

    const normalizedExpectation = TestUtils.normalizeOpenLyricsStringForTesting(
      `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="../stylesheets/openlyrics.css" type="text/css"?>
<song xmlns="http://openlyrics.info/namespace/2009/song"
      version="0.9"
      createdIn="LyricConverter ${packageFile.version}"
      modifiedIn="LyricConverter ${packageFile.version}"
      modifiedDate="2023-05-21T21:57:12">
  <properties>
    <titles>
      <title>Amazing Grace</title>
    </titles>
    <copyright>public domain</copyright>
    <released>1779</released>
    <ccliNo>4639462</ccliNo>
    <transposition>2</transposition>
    <key>C#</key>
    <variant>Newsboys</variant>
    <publisher>Sparrow Records</publisher>
    <keywords>something to help with more accurate results</keywords>
    <verseOrder>v1 v2  v3 c v4 c1 c2 b b1 b2</verseOrder>
    <authors>
      <author>John Newton </author>
      <author> Chris Rice </author>
      <author> Richard Wagner </author>
      <author> František Foo</author>
    </authors>
    <themes>
      <theme>Adoration </theme>
      <theme> Grace </theme>
      <theme> Praise </theme>
      <theme> Salvation </theme>
      <theme> Graça </theme>
      <theme> Adoração </theme>
      <theme> Salvação</theme>
    </themes>
    <tempo type="bpm">90</tempo>
    <comments>
      <comment>This is one of the most popular songs in our congregation.</comment>
    </comments>
    <songbooks>
      <songbook name="Songbook without Number" />
      <songbook name="Songbook with Number" entry="48" />
      <songbook name="Songbook with Letters in Entry Name" entry="153c" />
      </songbooks>
  </properties>
  <lyrics>
    <verse name="v1 (en)">
      <lines>
        Amazing grace how sweet the sound that saved a wretch like me;<br/>
        A b c<br/>
        D e f
      </lines>
    </verse>
    <verse name="v1 (de)">
      <lines>
        Erstaunliche Ahmut, wie
      </lines>
    </verse>
    <verse name="c">
      <lines>
        any comment<br/>
        Line content.
      </lines>
    </verse>
    <verse name="v2 (en-US)">
      <lines>
        any text<br/>
        Amazing grace how sweet the sound that saved a wretch like me;<br/>
        any text<br/>
        Amazing grace how sweet the sound that saved a wretch like me;<br/>
        Amazing grace how sweet the sound that saved a wretch like me;<br/>
        A b c<br/>
        <br/>
        D e f
      </lines>
    </verse>
    <verse name="e (de)">
      <lines>
        This is text of ending.
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
