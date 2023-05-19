import { TestUtils } from 'test/test-utils';
import { OutputTypeChordpro } from './output-type-chordpro';
import { mockSongObjects } from 'test/mock-song-objects';

describe('OutputTypeChordpro', () => {
  let outputType: OutputTypeChordpro;

  beforeEach(() => {
    outputType = new OutputTypeChordpro();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert a song to a text file', () => {
    const song = TestUtils.deepClone(mockSongObjects[0]!);

    expect(outputType.convertToType(song)).toEqual({
      songData: song,
      fileName: `${song.fileName}.${outputType.fileExt}`,
      outputContent: TestUtils.dedent`{title: Your Grace is Enough}
                                      {CCLI Number: 1234}
                                      {artist: Bethel Music}
                                      {key: G}

                                      Chorus:
                                      Your grace is enough
                                      Your grace is enough
                                      Your grace is enough for me

                                      Verse 1:
                                      Great is your faithfulness O God
                                      You wrestle with the sinners heart
                                      You lead us by still waters and to mercy
                                      And nothing can keep us apart

                                      Verse 2:
                                      Great is your love and justice God
                                      You use the weak to lead the strong
                                      You lead us in the song of your salvation
                                      And all your people sing along`,
    });
  });

  it('should not include info with blank values', () => {
    const song = TestUtils.deepClone(mockSongObjects[0]!);

    song.info.push({name: 'Test Blank', value: ''})

    expect(outputType.convertToType(song)).toEqual({
      songData: song,
      fileName: `${song.fileName}.${outputType.fileExt}`,
      outputContent: TestUtils.dedent`{title: Your Grace is Enough}
                                      {CCLI Number: 1234}
                                      {artist: Bethel Music}
                                      {key: G}

                                      Chorus:
                                      Your grace is enough
                                      Your grace is enough
                                      Your grace is enough for me

                                      Verse 1:
                                      Great is your faithfulness O God
                                      You wrestle with the sinners heart
                                      You lead us by still waters and to mercy
                                      And nothing can keep us apart

                                      Verse 2:
                                      Great is your love and justice God
                                      You use the weak to lead the strong
                                      You lead us in the song of your salvation
                                      And all your people sing along`,
    });
  });

  it('should not include slides with blank lyrics', () => {
    const song = TestUtils.deepClone(mockSongObjects[0]!);

    song.slides.push({title: 'Test Blank', lyrics: ''})

    expect(outputType.convertToType(song)).toEqual({
      songData: song,
      fileName: `${song.fileName}.${outputType.fileExt}`,
      outputContent: TestUtils.dedent`{title: Your Grace is Enough}
                                      {CCLI Number: 1234}
                                      {artist: Bethel Music}
                                      {key: G}

                                      Chorus:
                                      Your grace is enough
                                      Your grace is enough
                                      Your grace is enough for me

                                      Verse 1:
                                      Great is your faithfulness O God
                                      You wrestle with the sinners heart
                                      You lead us by still waters and to mercy
                                      And nothing can keep us apart

                                      Verse 2:
                                      Great is your love and justice God
                                      You use the weak to lead the strong
                                      You lead us in the song of your salvation
                                      And all your people sing along`,
    });
  });
});
