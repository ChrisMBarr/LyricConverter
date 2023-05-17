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
        lyrics: 'Your grace is enough\nYour grace is enough\nYour grace is enough for me',
      },
      {
        title: 'Verse 1',
        lyrics:
          'Great is your faithfulness O God\nYou wrestle with the sinners heart\nYou lead us by still waters and to mercy\nAnd nothing can keep us apart',
      },
      {
        title: 'Verse 2',
        lyrics:
          'Great is your love and justice God\nYou use the weak to lead the strong\nYou lead us in the song of your salvation\nAnd all your people sing along',
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
          'I know a place\nA wonderful place\nWhere accused and condemned\nFind mercy and grace\nWhere the wrongs we have done\nAnd the wrongs done to us\nWere nailed there with him \nThere on the cross',
      },
      {
        title: 'Chorus',
        lyrics: 'At the cross\nHe died for our sins\nAt the cross \nHe gave us life again',
      },
    ],
  },
  {
    fileName: 'Be Near.txt',
    title: 'Be Near',
    info: [
      {
        name: 'creatorCode',
        value: 1349676880,
      },
      {
        name: 'category',
        value: 'Song',
      },
      {
        name: 'artist',
        value: 'Shane Bernard',
      },
      {
        name: 'CCLISongTitle',
        value: 'Be Near',
      },
      {
        name: 'CCLIPublisher',
        value: 'Waiting Room Music',
      },
      {
        name: 'CCLICopyrightInfo',
        value: 2003,
      },
    ],
    slides: [
      {
        title: 'Background',
        lyrics: '',
      },
      {
        title: 'Verse 1 (1)',
        lyrics: 'You are all\nBig and small\nBeautiful',
      },
      {
        title: 'Verse 1 (2)',
        lyrics: "And wonderful to \nTrust in grace\nThrough faith\nBut I'm asking to taste",
      },
      {
        title: 'Bridge 1',
        lyrics:
          'For dark is light to You\nDepths are Height to you\nFar is near\nBut Lord I need to hear from You',
      },
      {
        title: 'Chorus',
        lyrics: 'Be near O God\nBe near O God of us\nYour nearness is\nTo us our good',
      },
      {
        title: 'Post-Chorus',
        lyrics: 'Our Good',
      },
      {
        title: 'Verse 2 (1)',
        lyrics: 'Your fullness is mine\nRevelation Divine',
      },
      {
        title: 'Verse 2 (2)',
        lyrics: 'But oh to taste\nTo know much\nMore than a page\nTo feel Your embrace',
      },
      {
        title: 'Ending',
        lyrics: 'My Good',
      },
      {
        title: '*blank*',
        lyrics: '',
      },
    ],
  },
];

export const mockEmptySong: ISong = {
  fileName: 'Empty.txt',
  title: 'Empty Title',
  info: [
  ],
  slides: [
    {
      title: 'Empty Slide',
      lyrics: '',
    },
  ],
};
