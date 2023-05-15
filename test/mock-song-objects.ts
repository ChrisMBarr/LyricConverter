import { ISong } from 'src/app/convert/models/song.model';

export const mockSongObjects: ISong[] = [
  {
    fileName: 'example-file.txt',
    title: 'Your Grace is Enough',
    info: [
      { name: 'CCLI Number', value: '1234' },
      { name: 'artist', value: 'Bethel Music' },
      { name: 'key', value: 'G' },
    ],
    slides: [
      {
        title: 'Chorus',
        lyrics: 'Your grace is enough\r\nYour grace is enough\r\nYour grace is enough for me',
      },
      {
        title: 'Verse 1',
        lyrics:
          'Great is your faithfulness O God\r\nYou wrestle with the sinners heart\r\nYou lead us by still waters and to mercy\r\nAnd nothing can keep us apart',
      },
      {
        title: 'Verse 2',
        lyrics:
          'Great is your love and justice God\r\nYou use the weak to lead the strong\r\nYou lead us in the song of your salvation\r\nAnd all your people sing along',
      },
    ],
  },
  {
    fileName: 'example-file2.txt',
    title: 'At the Cross',
    info: [
      { name: 'artist', value: 'Hymn' },
      { name: 'key', value: 'Hymn' },
      { name: 'comment', value: 'Words and Music by Randy & Terry Butler' },
    ],
    slides: [
      {
        title: 'Verse',
        lyrics:
          'I know a place\r\nA wonderful place\r\nWhere accused and condemned\r\nFind mercy and grace\r\nWhere the wrongs we have done\r\nAnd the wrongs done to us\r\nWere nailed there with him \r\nThere on the cross',
      },
      {
        title: 'Chorus',
        lyrics: 'At the cross\r\nHe died for our sins\r\nAt the cross \r\nHe gave us life again',
      },
    ],
  },
];
