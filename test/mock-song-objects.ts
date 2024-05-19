import { ISong } from '../src/app/convert/models/song.model';
import { version } from '../src/app/version';

export const mockStaticTimestamp = '2024-05-04T14:34:37.190Z';

export const mockSongObjects: Array<ISong> = [
  {
    originalFile: {
      extension: 'txt',
      format: 'Plain Text',
      name: 'example-file',
    },
    outputFileName: 'example-file',
    lyricConverterVersion: version,
    timestamp: mockStaticTimestamp,
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
    originalFile: {
      extension: 'txt',
      format: 'Plain Text',
      name: 'example-file2',
    },
    outputFileName: 'example-file2',
    lyricConverterVersion: version,
    timestamp: mockStaticTimestamp,
    title: 'At the Cross',
    info: [
      { name: 'artist', value: 'Hymn' },
      { name: 'key', value: 'E' },
      { name: 'comment', value: 'Words and Music by Randy & Terry Butler' },
      { name: 'Tempo', value: 'Moderate' },
    ],
    slides: [
      {
        title: 'Verse',
        lyrics:
          'I know a place\nA wonderful place\nWhere accused and condemned\nFind mercy and grace\nWhere the wrongs we have done\nAnd the wrongs done to us\nWere nailed there with him\nThere on the cross',
      },
      {
        title: 'Chorus',
        lyrics: 'At the cross\nHe died for our sins\nAt the cross\nHe gave us life again',
      },
    ],
  },
  {
    originalFile: {
      extension: 'txt',
      format: 'Plain Text',
      name: 'Be Near',
    },
    outputFileName: 'Be Near',
    lyricConverterVersion: version,
    timestamp: mockStaticTimestamp,
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
      {
        name: 'Keywords',
        value: 'Grace, Peace, Nearness',
      },
      {
        name: 'Time Signature',
        value: '3/4',
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
        lyrics: "And wonderful to\nTrust in grace\nThrough faith\nBut I'm asking to taste",
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
  {
    originalFile: {
      extension: 'txt',
      format: 'Plain Text',
      name: 'Amazing Grace',
    },
    outputFileName: 'Amazing Grace',
    lyricConverterVersion: version,
    timestamp: mockStaticTimestamp,
    title: 'Amazing Grace',
    info: [
      {
        name: 'Authors',
        value: 'John Newton | Chris Rice | Richard Wagner | František Foo',
      },
      {
        name: 'Comment',
        value: 'This is one of the most popular songs in our congregation.',
      },
      {
        name: 'Song Book 1',
        value: 'Songbook without Number',
      },
      {
        name: 'Song Book 2',
        value: 'Songbook with Number (entry 48)',
      },
      {
        name: 'Song Book 3',
        value: 'Songbook with Letters in Entry Name (entry 153c)',
      },
      { name: 'Tempo', value: '90bpm' },
      {
        name: 'Themes',
        value: 'Adoration | Grace | Praise | Salvation | Graça | Adoração | Salvação',
      },
      { name: 'copyright', value: 'public domain' },
      { name: 'ccliNo', value: '4639462' },
      { name: 'released', value: '1779' },
      { name: 'transposition', value: '2' },
      { name: 'key', value: 'C#' },
      { name: 'variant', value: 'Newsboys' },
      { name: 'publisher', value: 'Sparrow Records' },
      { name: 'keywords', value: 'something to help with more accurate results' },
      { name: 'verseOrder', value: 'v1 v2  v3 c v4 c1 c2 b b1 b2' },
    ],
    slides: [
      {
        title: 'v1 (en)',
        lyrics: 'Amazing grace how sweet the sound that saved a wretch like me;\nA b c\nD e f',
      },
      {
        title: 'v1 (de)',
        lyrics: 'Erstaunliche Ahmut, wie',
      },
      {
        title: 'c',
        lyrics: 'any comment\nLine content.',
      },
      {
        title: 'v2 (en-US)',
        lyrics:
          'any text\nAmazing grace how sweet the sound that saved a wretch like me;\nany text\nAmazing grace how sweet the sound that saved a wretch like me;\nAmazing grace how sweet the sound that saved a wretch like me;\nA b c\n\nD e f',
      },
      {
        title: 'e (de)',
        lyrics: 'This is text of ending.',
      },
    ],
  },
];

export const mockEmptySong: ISong = {
  originalFile: {
    extension: 'txt',
    name: 'Empty',
    format: 'Plain Text',
  },
  outputFileName: 'Empty',
  lyricConverterVersion: version,
  timestamp: mockStaticTimestamp,
  title: 'Empty Title',
  info: [],
  slides: [
    {
      title: 'Empty Slide',
      lyrics: '',
    },
  ],
};
