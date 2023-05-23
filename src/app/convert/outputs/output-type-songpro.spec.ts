import { mockEmptySong, mockSongObjects } from 'test/mock-song-objects';
import { OutputTypeSongPro } from './output-type-songpro';
import { TestUtils } from 'test/test-utils';

describe('OutputTypeSongPro', () => {
  let outputType: OutputTypeSongPro;

  beforeEach(() => {
    outputType = new OutputTypeSongPro();
  });

  it('should create an instance', () => {
    expect(outputType).toBeTruthy();
  });

  it('should convert a basic empty song to a SongPro file', () => {
    const song = TestUtils.deepClone(mockEmptySong);
    const outputFile = outputType.convertToType(song);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(outputFile.outputContent).toEqual(`@title=Empty Title`);
  });

  it('should convert a simple song (1) to a SongPro file', () => {
    const song = TestUtils.deepClone(mockSongObjects[0]!);
    const outputFile = outputType.convertToType(song);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(outputFile.outputContent).toEqual(`@title=Your Grace is Enough
@artist=Bethel Music
@key=G
!CCLI Number=1234

# Chorus

Your grace is enough
Your grace is enough
Your grace is enough for me

# Verse 1

Great is your faithfulness O God
You wrestle with the sinners heart
You lead us by still waters and to mercy
And nothing can keep us apart

# Verse 2

Great is your love and justice God
You use the weak to lead the strong
You lead us in the song of your salvation
And all your people sing along`);
  });

  it('should convert a song (2) to a SongPro file', () => {
    const song = TestUtils.deepClone(mockSongObjects[1]!);
    const outputFile = outputType.convertToType(song);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(outputFile.outputContent).toEqual(`@title=At the Cross
@artist=Hymn
@key=E
@tempo=Moderate
!comment=Words and Music by Randy & Terry Butler

# Verse

I know a place
A wonderful place
Where accused and condemned
Find mercy and grace
Where the wrongs we have done
And the wrongs done to us
Were nailed there with him
There on the cross

# Chorus

At the cross
He died for our sins
At the cross
He gave us life again`);
  });

  it('should convert a song (3) to a SongPro file', () => {
    const song = TestUtils.deepClone(mockSongObjects[2]!);
    const outputFile = outputType.convertToType(song);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(outputFile.outputContent).toEqual(`@title=Be Near
@artist=Shane Bernard
!creatorCode=1349676880
!category=Song
!CCLISongTitle=Be Near
!CCLIPublisher=Waiting Room Music
!CCLICopyrightInfo=2003
!Keywords=Grace, Peace, Nearness
!Time Signature=3/4

# Verse 1 (1)

You are all
Big and small
Beautiful

# Verse 1 (2)

And wonderful to
Trust in grace
Through faith
But I'm asking to taste

# Bridge 1

For dark is light to You
Depths are Height to you
Far is near
But Lord I need to hear from You

# Chorus

Be near O God
Be near O God of us
Your nearness is
To us our good

# Post-Chorus

Our Good

# Verse 2 (1)

Your fullness is mine
Revelation Divine

# Verse 2 (2)

But oh to taste
To know much
More than a page
To feel Your embrace

# Ending

My Good`);
  });

  it('should convert a song (4) to a SongPro file', () => {
    const song = TestUtils.deepClone(mockSongObjects[3]!);
    const outputFile = outputType.convertToType(song);

    expect(outputFile.songData).toEqual(song);
    expect(outputFile.fileName).toEqual(`${song.fileName}.${outputType.fileExt}`);
    expect(outputFile.outputContent).toEqual(`@title=Amazing Grace
@tempo=90bpm
@key=C#
!Authors=John Newton | Chris Rice | Richard Wagner | František Foo
!Comment=This is one of the most popular songs in our congregation.
!Song Book 1=Songbook without Number
!Song Book 2=Songbook with Number (entry 48)
!Song Book 3=Songbook with Letters in Entry Name (entry 153c)
!Themes=Adoration | Grace | Praise | Salvation | Graça | Adoração | Salvação
!copyright=public domain
!ccliNo=4639462
!released=1779
!transposition=2
!variant=Newsboys
!publisher=Sparrow Records
!keywords=something to help with more accurate results
!verseOrder=v1 v2  v3 c v4 c1 c2 b b1 b2

# v1 (en)

Amazing grace how sweet the sound that saved a wretch like me;
A b c
D e f

# v1 (de)

Erstaunliche Ahmut, wie

# c

any comment
Line content.

# v2 (en-US)

any text
Amazing grace how sweet the sound that saved a wretch like me;
any text
Amazing grace how sweet the sound that saved a wretch like me;
Amazing grace how sweet the sound that saved a wretch like me;
A b c

D e f

# e (de)

This is text of ending.`);
  });
});
