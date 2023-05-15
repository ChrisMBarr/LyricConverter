import { mockSongObjects } from 'test/mock-song-objects';
import { OutputTypeText } from './output-type-text';
import { dedent } from 'test/test-utils';

describe('OutputTypeText', () => {
  let outputType: OutputTypeText;

  beforeEach(() => {
    outputType = new OutputTypeText();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert a song to a text file', () => {
    const song = mockSongObjects[0]!;

    expect(outputType.convertToType(song)).toEqual({
      songData: song,
      fileName: `${song.fileName}.${outputType.friendlyFileExt}`,
      outputContent: dedent`Title: Your Grace is Enough
                            CCLI Number: 1234
                            artist: Bethel Music
                            key: G

                            Chorus
                            Your grace is enough
                            Your grace is enough
                            Your grace is enough for me

                            Verse 1
                            Great is your faithfulness O God
                            You wrestle with the sinners heart
                            You lead us by still waters and to mercy
                            And nothing can keep us apart

                            Verse 2
                            Great is your love and justice God
                            You use the weak to lead the strong
                            You lead us in the song of your salvation
                            And all your people sing along`,
    });
  });
});
