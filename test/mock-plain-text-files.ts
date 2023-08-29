import { IRawDataFile } from 'src/app/convert/models/file.model';

export const mockPlainTextFile1: IRawDataFile = {
  name: 'Your Grace is Enough',
  ext: 'txt',
  type: 'plain/text',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `Title: Your Grace is Enough
CCLI Number: 1234
artist: Bethel Music
key: G


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
};

export const mockPlainTextFile2: IRawDataFile = {
  name: 'At the Cross',
  ext: 'txt',
  type: 'plain/text',
  dataAsBuffer: new ArrayBuffer(0), //not needed for this file type
  dataAsString: `Title: At the Cross
artist: Hymn
key: E
comment: Words and Music by Randy & Terry Butler
comment: (c)1993 Mercy Publishing


Verse:
I know a place
A wonderful place
Where accused and condemned
Find mercy and grace
Where the wrongs we have done
And the wrongs done to us
Were nailed there with him
There on the cross

Chorus:
At the cross
He died for our sins
At the cross
He gave us life again
`,
};
