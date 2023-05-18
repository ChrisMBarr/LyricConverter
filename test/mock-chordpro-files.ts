import { IRawDataFile } from 'src/app/convert/models/file.model';

export const mockChordProFile1: IRawDataFile = {
  name: 'At The Cross',
  ext: 'cho',
  type: '',
  data: `{title: At the Cross}
{artist: Hymn}
{key: E}
{comment: Words and Music by Randy & Terry Butler}

Verse:
[E]I know a p[Bm7]lace
A w[A]onderful p[E]lace
Where accused and con[Bm7]demned
Find m[A]ercy and g[E]race
Where the w[E]rongs we have [Bm7]done
And the w[A]rongs done to u[E]s
Were nailed there with h[Bm7]im
T[A]here on the c[E]ross

{soc}
Chorus:
At the [D]cross [A]
He [G]died for our [E]sins
At the [D]cross [A]
He [G]gave us life [E]again
{eoc}

{comment: (c)1993 Mercy Publishing}
`,
};

export const mockChordProFile2: IRawDataFile = {
  name: 'Our Father',
  ext: 'chopro',
  type: '',
  data: `{title: Our Father}
{artist: Bethel Music}
{key: G}
{comment: Words and Music by Marcus Meier}

{gc:Intro:}
[G]  [C/E]  [C]

Verse:
Our Fa[G]ther in Heaven
Hal[C]lowed be Your [D]name
Your Kin[G]gdom come quickly
Your w[C]ill be done the s[D]ame

{soc}
Chorus:
On E[C]arth a[G/B]s it[Am] is in [Em]Heaven
Let He[D]aven come to
[C]Earth [G/B]as i[Am]t is in[Em] Heaven
Let He[D]aven [G]come
{eoc}

Bridge 1:
Let Heaven c[C]ome, let Heaven[Em] come
Let Heaven c[C]ome, let Heaven[Em] come

Bridge 2:
[C]Yours is the Kingdom, Yours is the p[D]ower
[Em]Yours is the glory [G/B]forever, amen
[C]Yours is the Kingdom, Yours is the p[D]ower
[Em]Yours is the glory [G/B]forever amen
`,
};

export const mockChordProFile3: IRawDataFile = {
  name: 'Swing Low Sweet Chariot',
  ext: 'cho',
  type: '',
  data: `# A simple ChordPro song.

  {title: Swing Low Sweet Chariot}

  {start_of_chorus}
  Swing [D]low, sweet [G]chari[D]ot,
  Comin’ for to carry me [A7]home.
  Swing [D7]low, sweet [G]chari[D]ot,
  Comin’ for to [A7]carry me [D]home.
  {end_of_chorus}

  I [D]looked over Jordan, and [G]what did I [D]see,
  Comin’ for to carry me [A7]home.
  A [D]band of angels [G]comin’ after [D]me,
  Comin’ for to [A7]carry me [D]home.

  {comment: Chorus}`,
};
